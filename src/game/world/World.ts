import * as THREE from "three";
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

export default class World extends Entity {
  public entities: Entity[] = [];
  private _threejs: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _controls: BasicCharacterController;
  private _stats: Stats;
  private _zombie: Zombie;
  private _loadingBar: LoadingBar;
  _manager: THREE.LoadingManager;
  private _grid: SpatialHashGrid;
  private _decorativeModelsFilepaths: Array<string>;
  planeActiveGrid: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  private _celPos: number[];

  awake() {
    //Renderer
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this._threejs.domElement);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    //Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x202020);
    var axesHelper = new THREE.AxesHelper(6);
    this._scene.add(axesHelper);

    //Camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    //Light
    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    let ambientLight = new THREE.AmbientLight(0x101010);
    ambientLight.intensity = 4
    this._scene.add(ambientLight);

    //Controls
    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    this._stats = Stats();
    document.body.appendChild(this._stats.domElement);

    //Skybox
    // const tgaLoader = new TGALoader();
    // const ft = tgaLoader.load("./images/skybox/skyboxMap/interstellar_ft.tga")
    // const bk = tgaLoader.load("./images/skybox/skyboxMap/interstellar_bk.tga")
    // const up = tgaLoader.load("./images/skybox/skyboxMap/interstellar_up.tga")
    // const dn = tgaLoader.load("./images/skybox/skyboxMap/interstellar_dn.tga")
    // const rt = tgaLoader.load("./images/skybox/skyboxMap/interstellar_rt.tga")
    // const lt = tgaLoader.load("./images/skybox/skyboxMap/interstellar_lt.tga")

    // const loader = new THREE.CubeTextureLoader();
    // const texture = loader.load([
    //   "../images/Meadow/posz.jpg",
    //   "./images/Meadow/negz.jpg",
    //   "./images/Meadow/posy.jpg",
    //   "./images/Meadow/negy.jpg",
    //   "./images/Meadow/negx.jpg",
    //   "./images/Meadow/posx.jpg",
    // ]);
    // this._scene.background = texture;
    this._scene.background = new THREE.Color(0x303050);

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
    this._scene.add(plane);

    //Grid
    this._grid = new SpatialHashGrid(
      [[-1000, -1000], [1000, 1000]], [100, 100]);

    //Loading Models
    this._decorativeModelsFilepaths = decorativeObjectFilepaths()
    this._loadingBar = new LoadingBar()
    this._loadingBar.visible = false;
    this._manager = new THREE.LoadingManager()
    this._manager.onLoad = () => this.onLoad()
    this.load();

    for (const entity of this.entities) {
      entity.awake()
    }
  }

  update(deltaTime) {
    for (const entity of this.entities) {
      entity.update(deltaTime)
    }
    this._stats.update();
    this._threejs.render(this._scene, this._camera);
    
    //experimental
    const pos = this._controls.getComponent(Transform).position
    if(this.planeActiveGrid) {
      this._celPos = this._grid.getCellPosition([pos.x, pos.z])
      

      this.planeActiveGrid.position.set(this._celPos[0], pos.y + 5, this._celPos[1])
    }
  }

  load() {
    this._loadingBar.visible = true
    this._LoadAnimatedModel();
    this._LoadDecorativeObjects()
    this._LoadZombies()
  }
  
  onLoad() {
    console.log('done');
    this._loadingBar.visible = false;
    for (const entity of this.entities) {
      entity.onLoad()
    }
    this._showActiveGrid()
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
      loadingBar: this._loadingBar,
      manager: this._manager,
      grid: this._grid
    };
    this._controls = new BasicCharacterController(params);
    this.entities.push(this._controls)
  }


  //experimental
  _showActiveGrid() {
    const pos = this._controls.getComponent(Transform).position
    // console.log(pos);
    new THREE.PlaneGeometry(10,10,2,2)
    this.planeActiveGrid = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    this._celPos = this._grid.getCellPosition([pos.x, pos.z])
    // console.log(_celPos);
    this.planeActiveGrid.position.set(this._celPos[0], pos.y + 5, this._celPos[1])
    this.planeActiveGrid.castShadow = false;
    this.planeActiveGrid.receiveShadow = true;
    this.planeActiveGrid.rotation.x = -Math.PI / 2;
    this._scene.add(this.planeActiveGrid)
  }

  _LoadZombies() {
    const params = {
      camera: this._camera,
      scene: this._scene,
      loadingBar: this._loadingBar,
      player: this._controls,
      manager: this._manager,
      grid: this._grid
    };
    for(let i = 0; i<20; i++) {
      const zombie = new Zombie(params);
      this.entities.push(zombie)
      
    }
  }
    
    _LoadDecorativeObjects() {
      const params = {
        camera: this._camera,
        scene: this._scene,
        loadingBar: this._loadingBar,
        manager: this._manager,
        grid: this._grid
      };
      // const model = new DecorativeObject(params, './models/decorativeObjects/'+this._decorativeModelsFilepaths[1]);
      //       this.entities.push(model)
      const list = this._decorativeModelsFilepaths;
      for(let i = 0; i <  list.length; i += 2) {
            const fp = './models/decorativeObjects/'+list[i+1]
            const mp = './models/decorativeObjects/'+list[i]
            const model = new DecorativeObject(params, fp, mp);
            this.entities.push(model)
        }
    }
  

  _OnWindowResize() {
    // Update sizes
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

}
