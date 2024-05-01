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
// // const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshStandardMaterial({ color: 'coral' })
// const geometry = new THREE.BoxGeometry(1, 1, 1)

// /**
//  * Plane
//  */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// scene.add(ground)

// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.y += 0.5
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
camera.position.set(24, 24, 24)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

const bodies = []
const num = 10

for (let i = 0; i < num; i++) {
	const body = new Body()
	bodies.push(body)
}

scene.add(...bodies)

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
// controls.autoRotate = true

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
	const dt = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	for (let i = 0; i < bodies.length; i++) {
		const bodyA = bodies[i]

		for (let j = i; j < bodies.length; j++) {
			const bodyB = bodies[j]

			bodyA.attract(bodyB, dt)
			bodyB.attract(bodyA, dt)
		}

		bodyA.update(dt)
	}

	// A.attract(B, dt)
	// A.attract(C, dt)

	// B.attract(A, dt)
	// B.attract(C, dt)

	// C.attract(A, dt)
	// C.attract(B, dt)

	// A.update(dt)
	// B.update(dt)
	// C.update(dt)

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
