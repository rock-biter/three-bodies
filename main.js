import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { AmbientLight, DirectionalLight } from 'three'
import Body from './src/Body'

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x121223)

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({ color: 'coral' })
const geometry = new THREE.BoxGeometry(1, 1, 1)

const nOfBodies = 2
const bodies = new Array(nOfBodies)

bodies[0] = new Body(
	1,
	100,
	new THREE.Vector3(20, 0, 0),
	new THREE.Vector3(0, 10, 0)
)
bodies[1] = new Body(
	1,
	100,
	new THREE.Vector3(-20, 0, 0),
	new THREE.Vector3(0, -10, 0)
)

bodies[2] = new Body(
	1,
	100,
	new THREE.Vector3(0, 0, -20),
	new THREE.Vector3(0, 0, 0)
)

scene.add(...bodies)

// for (let i = 0; i < nOfBodies; i++) {
// 	bodies[i] = new Body(1, 1)
// 	console.log(bodies[i])
// 	scene.add(bodies[i])
// }

/**
 * Plane
 */
const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
const groundGeometry = new THREE.PlaneGeometry(10, 10)
groundGeometry.rotateX(-Math.PI * 0.5)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

const mesh = new THREE.Mesh(geometry, material)
mesh.position.y += 0.5
// scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(30, 30, 30)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.autoRotate = true

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 1.5)
const directionalLight = new DirectionalLight(0xffffff, 4.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	bodies.forEach((b) => b.attract(bodies, deltaTime))
	bodies.forEach((b) => b.update())

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
