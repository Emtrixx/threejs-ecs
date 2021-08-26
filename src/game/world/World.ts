import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import BasicCharacterController from "../../character/CharacterController/BasicCharacterController";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

import Entity from "../../utils/ecs/Entity";

export default class World extends Entity {
    _threejs: THREE.WebGLRenderer;
    _camera: THREE.PerspectiveCamera;
    _scene: THREE.Scene;
    _controls: BasicCharacterController;
    _stats: Stats;
  
    // public get()
  
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
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
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
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
        })
      );
      plane.castShadow = false;
      plane.receiveShadow = true;
      plane.rotation.x = -Math.PI / 2;
      this._scene.add(plane);
  
      // this._LoadModel()
      this._LoadAnimatedModel();
      // this._LoadZombie()
    //   this._RAF();
    }
  
    _LoadAnimatedModel() {
      const params = {
        camera: this._camera,
        scene: this._scene,
      };
      this._controls = new BasicCharacterController(params);
    }
  
    // _LoadZombie() {
    //   const params = {
    //     camera: this._camera,
    //     scene: this._scene,
    //     player: this._controls
    //   };
    //   this._zombie = new Zombie(params);
    // }
  
    _Step(timeElapsed) {
      const time = timeElapsed;
  
      if (this._controls) {
        this._controls.update(time);
      }
  
      // if(this._zombie) {
      //   this._zombie.Update(time)
      // }
    }
  
    _OnWindowResize() {
      // Update sizes
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._threejs.setSize(window.innerWidth, window.innerHeight);
    }
  
    update(deltaTime) {
        this._stats.update();
        this._threejs.render(this._scene, this._camera);
        this._Step(deltaTime);
    }
  
    // _LoadModel() {
    //   const loader = new GLTFLoader()
    //   loader.load('./models/Boxhead.gltf', gltf => {
    //     gltf.scene.traverse(c => {
    //       c.castShadow = true
    //     })
    //     this._scene.add(gltf.scene)
    //   })
    // }
  }
  