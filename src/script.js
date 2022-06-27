import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//const dracoLoader = new DRACOLoader()
//dracoLoader.setDecoderPath('/draco/')

const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
     
        }, 500)
       
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
// CREATE A COLLADALOADER INSTANCE
var loaders = new ColladaLoader(loadingManager);
// SETTING THE BASE RESOURCE URL FOR TEXTTURES
loaders.setResourcePath('/models/');
loaders.load(
    '/models/model.dae',
    (collada)=>{
        console.log(collada)
        //   const children =[...gltf.scene.children]
        //   for(const child of children){
        //     scene.add(child)
        //   }
       // mixer = new THREE.AnimationMixer(gltf.scene)
       // const action = mixer.clipAction(gltf.animations[2])
       // action.play()
       collada.materials= new THREE.MeshBasicMaterial( { color: 'red', wireframe: false } );

        collada.scene.scale.set(0.0090,0.0090,0.0090 )
        collada.scene.position.set(-7.5,-1.1,4)
        scene.add(collada.scene)
    }
)
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

//fog
const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
grassColorTexture.repeat.set(8,8) 
grassAmbientOcclusionTexture.repeat.set(8,8) 
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)


grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const loader = new FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', ( font )=> {

	const textGeometry = new TextGeometry( 'Haunting House', {
		font: font,
		size: 0.6,
		height: 0.2,
		curveSegments: 8 ,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4
	} )
    textGeometry.computeBoundingBox()
    textGeometry.translate(
        - (textGeometry.boundingBox.max.x)*0.5, 
        + (textGeometry.boundingBox.max.y)*9,
        - (textGeometry.boundingBox.max.z)*0.5
    )
    const material = new THREE.MeshBasicMaterial({color: 'black'})
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
});
/**
 * House
//  */
// const house = new THREE.Group()
// scene.add(house)
//Walls
// const walls = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(4,2.5,4),
//     new THREE.MeshStandardMaterial({ 
//         map: bricksColorTexture,
//         aoMap: bricksAmbientTexture,
//         normalMap: bricksNormalTexture,
//         roughnessMap: bricksRoughnessTexture
//     })
// )
// walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))
// walls.position.y = 1.25
// house.add(walls)
//roof
// const roof = new THREE.Mesh(
//     new THREE.ConeBufferGeometry(3.5,1,4),
//     new THREE.MeshStandardMaterial({color: '#b35f45'})
// )
// roof.rotation.y = Math.PI*0.25
// roof.position.y = 2.5 + 1/2
// house.add(roof)
//door
// const door = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
//     new THREE.MeshStandardMaterial({
//         map:doorColorTexture,
//         transparent: true,
//         alphaMap: doorAlphaTexture,
//         aoMap: doorAmbientTexture,
//         displacementMap: doorheightTexture,
//         displacementScale:0.1,
//         normalMap: doorNormalTexture,
//         metalnessMap: doorMetalnessTexture,
//         roughnessMap: doorRoughnessTexture

    
//     }))
//     door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
// door.position.y =1
// door.position.z = 2+0.01
// house.add(door)
// //bushes
// const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
// const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})
// const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
// bush1.scale.set(0.5,0.5,0.5)
// bush1.position.set(0.8,0.2,2.2)

// const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
// bush2.scale.set(0.25,0.25,0.25)
// bush2.position.set(1.4,0.1,2.1)

// const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
// bush3.scale.set(0.4,0.4,0.4)
// bush3.position.set(-0.8,0.1,2.2)

// const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
// bush4.scale.set(0.15,0.15,0.15)
// bush4.position.set(-1,0.05,2.6)

// house.add(bush1,bush2,bush3,bush4)
// //graves
const graves = new THREE.Group()
scene.add(graves)
const graveGeometry = new THREE.BoxBufferGeometry(.6,.8,.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i = 0; i <80;i++){  
    const angle = Math.random() * Math.PI *3
    const radius = 3 + Math.random() * 8 
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.z = (Math.random() - 0.5)*0.4
    grave.rotation.y = (Math.random() - 0.5)*0.4
    grave.castShadow= true
    graves.add(grave)
}




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
     })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', .1)
moonLight.position.set(4, 5, - 2)

// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// const spot = new THREE.SpotLight('#b9d5ff',.8)
// spot.position.set(0,2,-.1)
// scene.add(spot)

//pointlight
// const doorLight = new THREE.PointLight('#ff7d46',1,7)
// doorLight.position.set(0,2.2,2.7)
// house.add(doorLight)

const ghost1 = new THREE.PointLight('#ff00ff',2,3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff',2,3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00',2,3)
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(72, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 4, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minPolarAngle = Math.PI / 6; 
controls.maxPolarAngle = Math.PI / 2.5;
controls.minDistance=3
controls.maxDistance=11

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#262837')
//shadows
renderer.shadowMap.enabled = true
moonLight.castShadow = true
// doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
// walls.castShadow = true
// bush1.castShadow = true
// bush2.castShadow = true
// bush3.castShadow = true
// bush4.castShadow = true
floor.receiveShadow = true
// optimize
// doorLight.shadow.mapSize.width = 256
// doorLight.shadow.mapSize.height = 256
// doorLight.shadow.camera.far = 7
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const ghostAngle = elapsedTime
    ghost1.position.x = Math.cos(ghostAngle)*4
    ghost1.position.z = Math.sin(ghostAngle)*4
    ghost1.position.y = Math.sin(elapsedTime)*4

    const ghost2Angle = -elapsedTime *0.32
    ghost2.position.x = Math.cos(ghost2Angle)*5
    ghost2.position.z = Math.sin(ghost2Angle)*5
    ghost2.position.y = Math.sin(elapsedTime*4) + Math.sin(elapsedTime*2.5)
    
    const ghost3Angle = -elapsedTime *0.18
    ghost3.position.x = Math.cos(ghost3Angle)*(7+Math.sin(elapsedTime*0.32))
    ghost3.position.z = Math.sin(ghost3Angle)*(7+Math.sin(elapsedTime*0.5))
    ghost3.position.y = Math.sin(elapsedTime*5) + Math.sin(elapsedTime*2)
    // Update controls
    controls.update()
  
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
