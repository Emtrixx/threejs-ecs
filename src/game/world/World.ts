import * as THREE from "three";
import * as CANNON from 'cannon-es';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import BasicCharacterController from "../../character/CharacterController/BasicCharacterController";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";
import { LoadingBar } from "../../utils/LoadingBar";
import Entity from "../../utils/ecs/Entity";
import { Zombie } from "../../character/Zombie/Zombie";
import { SpatialHashGrid } from "../../utils/SpatialHashGrid";
import { DecorativeObject } from "./DecorativeObject";
import { decorativeObjectFilepaths } from "../../settings/DecorativeFilepaths";
import { Transform } from "../../components/transform";
import Ball from "../other/Ball";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { Robot } from "../../character/Robot/Robot";

export default class World extends Entity {
  public entities: Entity[] = [];
  private threejs: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: BasicCharacterController;
  private stats: Stats;
  private zombie: Zombie;
  private loadingBar: LoadingBar;
  manager: THREE.LoadingManager;
  private grid: SpatialHashGrid;
  private decorativeModelsFilepaths: Array<string>;
  light: THREE.DirectionalLight;
  private pworld: CANNON.World;
  //experimental
  planeActiveGrid: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  private celPos: number[];
  debugBody: CANNON.Body;
  debugBall: THREE.Mesh;
  skyboxArr: any[];
  listener: THREE.AudioListener;

  awake() {
    //Renderer
    this.threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs.setSize(window.innerWidth, window.innerHeight);
    this.threejs.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.OnWindowResize();
      },
      false
    );

    //Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);
    var axesHelper = new THREE.AxesHelper(6);
    this.scene.add(axesHelper);

    // Physics
    this.pworld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    })
    // Create a static plane for the ground
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    this.pworld.addBody(groundBody)

    //Camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(75, 20, 0);

    //Light
    this.light = new THREE.DirectionalLight(0xffffff, 1.0);
    this.light.position.set(20, 100, 10);
    this.light.target.position.set(0, 0, 0);
    this.light.castShadow = true;
    this.light.shadow.bias = -0.001;
    this.light.shadow.mapSize.width = 4096;
    this.light.shadow.mapSize.height = 4096;
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = 500.0;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 500.0;
    this.light.shadow.camera.left = 100;
    this.light.shadow.camera.right = -100;
    this.light.shadow.camera.top = 100;
    this.light.shadow.camera.bottom = -100;
    this.scene.add(this.light);
    this.scene.add(this.light.target);

    let ambientLight = new THREE.AmbientLight(0x101010);
    ambientLight.intensity = 4
    this.scene.add(ambientLight);

    //Controls
    // const controls = new OrbitControls(this.camera, this.threejs.domElement);
    // controls.target.set(0, 20, 0);
    // controls.update();

    this.stats = Stats();
    document.body.appendChild(this.stats.domElement);

    // Skybox
    // this.scene.background = new THREE.Color(0x303050);
    this.loadSkybox();

    //Fog
    // this.scene.fog = new THREE.Fog(0x000000, 0, 400)

    //Geometry
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x2b4533,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

    //Grid
    this.grid = new SpatialHashGrid(
      [[-1000, -1000], [1000, 1000]], [100, 100]);

    // Canon Helper
    // @ts-ignore: cannon helper
    //window.cannonHelper = new CannonHelper(this.scene, this.pworld);

    //Loading Models
    this.decorativeModelsFilepaths = decorativeObjectFilepaths()
    this.loadingBar = new LoadingBar()
    this.loadingBar.visible = false;
    this.manager = new THREE.LoadingManager()
    this.manager.onLoad = () => this.onLoad()
    this.load();


    for (const entity of this.entities) {
      entity.awake()
    }
  }

  update(deltaTime) {
    //Debug
    //  this.debugBall.position.copy(this.debugBody.position);
    // @ts-ignore: cannon helper
    //window.cannonHelper.update();
    //

    for (const entity of this.entities) {
      entity.update(deltaTime)
    }
    this.stats.update();

    this.pworld.fixedStep();

    this.threejs.render(this.scene, this.camera);

    //experimental
    // const pos = this.controls.getComponent(Transform).position
    // if (this.planeActiveGrid) {
    //   this.celPos = this.grid.getCellPosition([pos.x, pos.z])
    //   this.planeActiveGrid.position.set(this.celPos[0], pos.y + 5, this.celPos[1])
    // }
  }

  load() {
    this.loadingBar.visible = true
    this.LoadAnimatedModel();
    this.LoadDecorativeObjects();
    this.LoadAmbientSound();
    this.LoadZombies();
    this.LoadBall();
    // this.loadRobot();
    // this.debugPhysics();
  }

  onLoad() {
    console.log('done');
    this.loadingBar.visible = false;
    for (const entity of this.entities) {
      entity.onLoad()
    }
    // this.showActiveGrid()
  }

  LoadAnimatedModel() {
    const params = {
      camera: this.camera,
      light: this.light,
      scene: this.scene,
      loadingBar: this.loadingBar,
      manager: this.manager,
      grid: this.grid,
      pworld: this.pworld,
    };
    this.controls = new BasicCharacterController(params);
    this.entities.push(this.controls)
  }

  LoadBall() {
    const params = {
      camera: this.camera,
      light: this.light,
      scene: this.scene,
      loadingBar: this.loadingBar,
      manager: this.manager,
      grid: this.grid,
      pworld: this.pworld,
    };
    this.entities.push(new Ball(params));
  }

  debugPhysics() {
    // Real Body
    const ballRadius = 2;
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
    const ball = new THREE.Mesh(ballGeometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
    ball.position.set(0, 40, 0);
    console.log(ball.geometry.getAttribute('radius'));
    this.debugBall = ball;
    this.scene.add(ball);


    // Physic body
    const radius = 1 // m
    this.debugBody = new CANNON.Body({
      mass: 5, // kg
      shape: new CANNON.Sphere(radius + 2),
    })
    this.debugBody.position.set(0, 40, 0) // m
    this.pworld.addBody(this.debugBody)

    //Cannon Helper
    // @ts-ignore: cannon helper
    //window.cannonHelper.addVisual(this.debugBody);
  }

  LoadAmbientSound() {
    // create an AudioListener and add it to the camera
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    // create a global audio source
    const sound = new THREE.Audio(this.listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/ambientForest.wav', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
  }

  LoadZombies() {
    const params = {
      camera: this.camera,
      scene: this.scene,
      loadingBar: this.loadingBar,
      player: this.controls,
      manager: this.manager,
      grid: this.grid,
      pworld: this.pworld,
      listener: this.listener,
    };
    for (let i = 0; i < 8; i++) {
      const zombie = new Zombie(params);
      this.entities.push(zombie)

    }
  }

  LoadDecorativeObjects() {
    const params = {
      camera: this.camera,
      scene: this.scene,
      loadingBar: this.loadingBar,
      manager: this.manager,
      grid: this.grid,
      pworld: this.pworld,
    };
    const list = this.decorativeModelsFilepaths;
    for (let i = 0; i < list.length; i++) {
      const fp = './models/decorativeObjects/' + list[i] + '.obj'
      const mp = './models/decorativeObjects/' + list[i] + '.mtl'
      const model = new DecorativeObject(params, fp, mp);
      this.entities.push(model)
    }
  }

  loadSkybox() {
    //Skybox
    // const pathArr = [
    //   "./images/galaxy/galaxy+Z.tga",
    //   "./images/galaxy/galaxy-Z.tga",
    //   "./images/galaxy/galaxy+Y.tga",
    //   "./images/galaxy/galaxy-Y.tga",
    //   "./images/galaxy/galaxy+X.tga",
    //   "./images/galaxy/galaxy-X.tga",
    // ]
    // this.skyboxArr = [];
    // const tgaLoader = new TGALoader(this.manager);
    // pathArr.forEach(path => {
    //   tgaLoader.load(path, (texture)=> {
    //     this.skyboxArr.push(texture);
    //   })
    // })
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './images/space/weltraum.png',
      './images/space/weltraumh.png',
      './images/space/weltraumo.png',
      './images/space/weltraumu.png',
      './images/space/weltrauml.png',
      './images/space/weltraumr.png',
    ]);
    this.scene.background = texture;
  }

  // loadPiano() {
  //   //params new piano
  //   const params = {
  //     camera: this.camera,
  //     scene: this.scene,
  //     loadingBar: this.loadingBar,
  //     manager: this.manager,
  //     grid: this.grid,
  //     pworld: this.pworld,
  //     listener: this.listener,
  //   };
  //   const piano = new Piano(params);
  //   this.entities.push(piano)
  // }

  loadRobot() {
    // const params = {
    //   camera: this.camera,
    //   scene: this.scene,
    //   loadingBar: this.loadingBar,
    //   manager: this.manager,
    //   grid: this.grid,
    //   pworld: this.pworld,
    //   listener: this.listener,
    // };
    // const robot = new Robot(params);
    // this.entities.push(robot)
    const vertices = new Float32Array([
      0.230335,0.042676, -0.267800, 
      0.019082,0.267800, -0.267800, 
      0.230335,0.042676, 0.267800, 
      0.019082,0.267800, 0.267800, 
      0.230335,-0.267800, -0.267800, 
      0.019082,-0.267800, -0.267800, 
      0.230335,-0.267800, 0.267800, 
      0.019082,-0.267800, 0.267800, 
    ])
    const footGeometry = new THREE.BufferGeometry();
    footGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // footGeometry.setIndex(indices);
    footGeometry.computeVertexNormals();
    footGeometry.translate(0, 1, 0);
    const foot = new THREE.Mesh(footGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
    foot.scale.multiplyScalar(2);
    foot.castShadow = true;
    this.scene.add(foot);
  }

  OnWindowResize() {
    // Update sizes
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.threejs.setSize(window.innerWidth, window.innerHeight);
  }


  //experimental
  //shows a white plane for the current grid cell of the player
  showActiveGrid() {
    const pos = this.controls.getComponent(Transform).position
    new THREE.PlaneGeometry(10, 10, 2, 2)
    this.planeActiveGrid = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      })
    );
    this.celPos = this.grid.getCellPosition([pos.x, pos.z])
    this.planeActiveGrid.position.set(this.celPos[0], pos.y + 5, this.celPos[1])
    this.planeActiveGrid.castShadow = false;
    this.planeActiveGrid.rotation.x = -Math.PI / 2;
    this.scene.add(this.planeActiveGrid)
  }
}
