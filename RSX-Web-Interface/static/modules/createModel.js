import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let modelLoaded = false;


class SceneManager{

    constructor(container, [initialWidth, initialHeight]){
        this.container = container;
        this.width = initialWidth;
        this.height = initialHeight;
        this.model;
        this.modelLoaded;
        this.scene = new THREE.Scene();
        this.camera;
        this.renderer;
        this.frameCount;

        this.animate = this.animate.bind(this);
        this.resizeScene = this.resizeScene.bind(this);
    }

    create(){
        window.addEventListener('resize', this.resizeScene);

        // SCENE & CAMERA
        this.scene.background = new THREE.Color(0x888888)
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

        // LOADER
        this.loader = new GLTFLoader();

        // DRACO
        this.draco = new DRACOLoader();
        this.draco.setDecoderPath('/examples/jsm/libs/draco');
        this.loader.setDRACOLoader(this.draco);


        // RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);

        // CAMERA CONTROL
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // LIGHT
        const light = new THREE.PointLight(0xffffff, 100)
        light.position.set(2.5, 2.5, 2.5)
        this.scene.add(light)

        // SHOW AXES
        const axes = new THREE.AxesHelper(5);
        this.scene.add(axes);

        // ADD ELEMENT
        this.container.appendChild(this.renderer.domElement);

        // CAPSULE
        this.modelLoaded = false;
        this.loader.load('/capsuleAsset/capsule1.gltf', (gltf) => {


            this.scene.add(gltf.scene);

            gltf.asset;

            this.model = gltf.scene;

            //centerModel(this.model, 0.01);

            this.modelLoaded = true;

            let geometry = findType(this.model, 'Mesh');

            this.model.prevPositon = this.model.quaternion;

            //addArrowToScene();
        }, 
        (xhr) => {console.log((xhr.loaded/xhr.total * 100) + '% Loaded')},
        (err) => {console.log('error', err)});




        // CAMERA ADJUST
        this.camera.position.set(0, 3, 5);
        this.camera.lookAt(0, 0, 0);

        // ARROW VARIABLE
        let arrow;
        const origin = new THREE.Vector3(0, 0, 0);

        arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 2, 0x00ff00);
        this.scene.add(arrow);

        console.log(this);


        // START ANIMATION
        this.renderer.setAnimationLoop(this.animate);
    }

    // ANIMATION
    animate(){
        this.frame++;
        this.renderer.render(this.scene, this.camera);

        if(modelLoaded){
            //rotateWithQuaternion(model);
            //console.log(model.prevPositon);
        }
    }

    centerModel(precisionAmount){
        const geometry = findType(this.object, 'Mesh');
        console.log(geometry);

        geometry.center();
    }
    
    resizeScene(){

        
        let containerDimensions = this.container.getBoundingClientRect();


        this.camera.aspect = containerDimensions.width / containerDimensions.height;
    
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(containerDimensions.width, containerDimensions.height);
    }

    applyQuaternion(object, gyroscopeData){

        if(modelLoaded){

            let prevQuaternion = object.quaternion;

            let newQuaternion = calculateNewQuaternion(prevQuaternion, gyroscopeData);

            object.quaternion.slerp(newQuaternion, 0.5);
        }
    }

    calculateNewQuaternion(prevQuaternion, gyroscopeData){

        // Angular velocities in respective axes
        const angV_X = toRad(gyroscopeData['Gyroscope_x'])/2;
        const angV_Y = toRad(gyroscopeData['Gyroscope_y'])/2;
        const angV_Z = toRad(gyroscopeData['Gyroscope_z'])/2;

        // https://www.steppeschool.com/pages/blog/imu-and-quaternions
        let matrixA = [
            [1, -angV_X, -angV_Y, -angV_Z],
            [angV_X, 1, angV_Z, -angV_Y],
            [-angV_Y, -angV_Z, 1, angV_X],
            [angV_Z, angV_Y, -angV_X, 1]
        ];

        let matrixB = [
            [prevQuaternion.x],
            [prevQuaternion.w],
            [prevQuaternion.y],
            [prevQuaternion.z]
        ];

        let result = multiplyMatricies(matrixA, matrixB);
        
        let newQuaternion = new THREE.Quaternion(result[0][0][0], result[1][0][0], result[2][0][0], result[3][0][0]);
        newQuaternion.normalize();

        return newQuaternion;
        
    }
}



function multiplyMatricies(A, B){


        if (A[0].length == B.length){
            console.log('works', A.length);

            let result = []

            for(let i = 0; i < A.length; i++){
                let row = []

                for(let j = 0; j < B[0].length; j++){

                    let total = 0;

                    for(let k = 0; k < A[0].length; k++){

                        //console.log(i, j, k);
                        total = total + (A[i][k] * B[k][j]);
                    }

                    //console.log(total);
                    row.push([total]);
                }

                result.push(row);


            }

            return result;

        } else {
            console.log('cannot multiply matricies');
        }


}

// angV = angular velocity
function toRad(angV){
    return ((angV * Math.PI)/180);
}

function findType(obj, type){
    let geometry;

    obj.children.forEach((child) => {
        if (child.type === type){
            geometry = child.geometry;
        }
    });

    return geometry;
}

let testNum = 0
setInterval(() => {
    if(modelLoaded){
        applyQuaternion(model, data[testNum++])
    }
}, 100)


export default function createScene(container, [initialWidth, initialHeight]){
    let scene = new SceneManager(container, [initialWidth, initialHeight]);

    return scene;
}
