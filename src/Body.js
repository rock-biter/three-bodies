import { IcosahedronGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three'

const geometry = new IcosahedronGeometry(1, 2)

const G = 100
const _V = new Vector3()

export default class Body extends Mesh {
	nexTicPosition = new Vector3()

	constructor(
		radius = 1,
		mass = 10,
		position = new Vector3().randomDirection().multiplyScalar(20),
		velocity = new Vector3().randomDirection().multiplyScalar(2)
	) {
		const material = new MeshStandardMaterial({
			color: Math.random() * 0xffffff,
		})

		super(geometry, material)

		this.radius = radius
		this.scale.setScalar(radius)
		this.mass = mass
		this.position.copy(position)
		this.nexTicPosition.copy(position)
		this.velocity = velocity.clone()
	}

	attract(bodies, dt) {
		const force = new Vector3()

		bodies.forEach((body) => {
			if (body === this) return
			const r = _V.copy(body.position).sub(this.position)
			const sqDistance = r.lengthSq()
			force.add(
				r.normalize().multiplyScalar((G * (this.mass * body.mass)) / sqDistance)
			)
		})

		const a = force.multiplyScalar(1 / this.mass)
		const v = a.multiplyScalar(dt)
		this.velocity.add(v)

		// if (this.velocity.length() > 20) {
		// 	this.velocity.normalize().multiplyScalar(20)
		// }

		this.nexTicPosition = this.position
			.clone()
			.addScaledVector(this.velocity, dt)
	}

	update() {
		this.position.copy(this.nexTicPosition)
	}
}
