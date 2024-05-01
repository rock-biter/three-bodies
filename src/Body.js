import {
	BufferGeometry,
	IcosahedronGeometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshStandardMaterial,
	Vector3,
} from 'three'

const GEOM = new IcosahedronGeometry(1, 3)
const G = 50
const _V = new Vector3()
export default class Body extends Mesh {
	constructor(r = 1, m = 1) {
		const color = Math.random() * 0xffffff
		const material = new MeshStandardMaterial({
			color,
		})

		super(GEOM, material)

		this.color = color
		this.radius = r
		this.mass = m

		this.position.randomDirection().multiplyScalar(20)
		this.velocity = new Vector3()
	}

	attract(body, dt) {
		const mass1 = this.mass
		const mass2 = body.mass
		const distance = Math.max(this.position.distanceTo(body.position), 1)
		const dir = _V.copy(body.position).sub(this.position).normalize()

		const forceMagnitude = G * mass1 * mass2
		const force = dir.multiplyScalar(forceMagnitude)

		const a = force.multiplyScalar(1 / this.mass)

		this.velocity.addScaledVector(a, dt)
	}

	update(dt) {
		const points = [this.position.clone()]

		this.position.addScaledVector(this.velocity, dt)

		// points.push(this.position.clone())

		// const geometry = new BufferGeometry().setFromPoints(points)
		// const material = new LineBasicMaterial({
		// 	color: this.color,
		// 	transparent: true,
		// 	opacity: 0.5,
		// })
		// const line = new Line(geometry, material)

		// this.parent.add(line)
	}
}
