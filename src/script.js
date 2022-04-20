import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
/**
 * Base
 */
/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// GlTF loader 
const loader = new GLTFLoader()
loader.load('/model/scene.gltf', (gltf) => {
    let model = gltf.scene
    model.scale.set(0.03, 0.03, 0.03)
    model.position.set(0, -0.5, -1.3)

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        }
    })
    scene.add(model)
})
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 3)
camera.position.set(0, 0, 1.1)
scene.add(camera)

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        depthInfo: { value: null },
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


let geometry1 = new THREE.PlaneBufferGeometry(1, 0.01, 100, 1)
let number = 20
// for (let i = 0; i < number; i++) {
//     let mesh1 = new THREE.Mesh(geometry1, material)
//     mesh1.position.y = (i-number/2)/number
//     scene.add(mesh1)
// }

// Target 

let target = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
target.texture.minFilter = THREE.NearestFilter;
target.texture.magFilter = THREE.NearestFilter;
target.stencilBuffer = false;
target.depthTexture = new THREE.DepthTexture();
target.depthTexture.format = THREE.DepthFormat;
target.depthTexture.type = THREE.UnsignedShortType;

window.addEventListener('resize', () => {
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
// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)
/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xffffff, 1)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    // Update controls
    controls.update()

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime()

    // Update uniforms
    material.uniforms.uTime.value = elapsedTime

    // Render
    renderer.setRenderTarget(target)
    renderer.render(scene, camera)
    material.uniforms.depthInfo.value = target.depthTexture
    renderer.setRenderTarget(null)
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()