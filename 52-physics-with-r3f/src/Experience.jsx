import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { BallCollider, CuboidCollider, Debug, RigidBody, Physics, CylinderCollider, InstancedRigidBodies } from '@react-three/rapier'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience() {
    const [hitSound] = useState(() => new Audio('./hit.mp3'))
    const burger = useGLTF('./hamburger.glb')

    //Rigid body can only be added inside physics element
    //rigid body trys to match size of mesh
    //will encompas a rec (shape changes for rects)
    //hull is like putting a membrane around the object
    //trimesh will create triangle mesh around object
    // put rotation and pos on rigid body
    //gravityScale on a rigid body will affect individuals gravity
    //resitution is "bouncyness"
    //collider to generate collider
    //coefficentCombineRule also needed for collider
    //mass is auto calculated by sum of colliders in a rigid body
    //kinematic is good for controling things (like a player)

    //EVENTS: onCollisionEnter, onCollisionExit, onSleep, onWake


    const cubeRef = useRef()
    const twisterRef = useRef()


    const cubeJump = () => {
        const mass = cubeRef.current.mass()
        cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5
        })
    }

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler(0, time * 3, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)

        twisterRef.current.setNextKinematicRotation(quaternionRotation)
        const angle = time * 0.5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2

        twisterRef.current.setNextKinematicTranslation({ x: x, y: - 0.8, z: z })
    })

    const collisionEnter = () => {
        // hitSound.currentTime = 0
        // hitSound.volume = Math.random()
        // hitSound.play()
    }

    const cubesCount = 700
    const cubesRef = useRef()

    const cubeTransforms = useMemo(() => {
        const positions = []
        const rotations = []
        const scales = []

        for (let i = 0; i < cubesCount; i++) {
            positions.push([(Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8])
            rotations.push([Math.random(), Math.random(), Math.random()])

            const scale = 0.2 + Math.random() * 0.8
            scales.push([scale, scale, scale])
        }

        return { positions, rotations, scales }
    })

    // useEffect(() => {
    //     //THIS WILL REDUCE DRAW CALLS!
    //     for (let i = 0; i < cubesCount; i++) {
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubesRef.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    return <>


        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        ``
        <Physics gravity={[0, -9.8, 0]}>
            {/* <Debug /> */}
            <RigidBody colliders="ball">
                <mesh castShadow position={[-1.5, 2, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody position={[1.5, 2, 0]}
                ref={cubeRef}
                gravityScale={1}
                restitution={0}
                friction={0.7}
                colliders={false}
                onCollisionEnter={collisionEnter}
            //onSleep={()=> {console.log('sleep')}}
            //onWake={()=> {console.log('wake')}}
            >
                {/* <mesh castShadow position={[2, 2, 0]}>
                    <boxGeometry args={[3,2,1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh> */}
                <mesh castShadow onClick={cubeJump}   >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider mass={4.9} args={[0.5, 0.5, 0.5]} />
            </RigidBody>

            {/* <RigidBody colliders={false} position={[0, 1, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
                 <CuboidCollider args={[1.5, 1.5, 0.5]} />
                <CuboidCollider args={ [ 0.25, 1, 0.25 ] } position={ [ 0, 0, 1 ] } rotation={ [ - Math.PI * 0.35, 0, 0 ] } /> 
                <BallCollider args={[1.5]}/>
                <mesh castShadow >
                    <torusGeometry args={[1, 0.5, 16, 32]} />
                    <meshNormalMaterial />
                </mesh>
            </RigidBody> */}

            <RigidBody type="fixed"
                friction={0.7}
            >
                <mesh receiveShadow position-y={- 1.25} >
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody position={[0, -0.8, 0]}
                friction={0}
                type="kinematicPosition"
                ref={twisterRef}>
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <RigidBody colliders={false}
                position={[0, 4, 0]}>
                <primitive object={burger.scene} scale={.25} />
                <CylinderCollider args={[0.5, 1.25]} />
            </RigidBody>

            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, - 5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[- 5.5, 1, 0]} />
            </RigidBody>

            <InstancedRigidBodies
                positions={cubeTransforms.positions}
                rotations={cubeTransforms.rotations}
                scales={cubeTransforms.scales}>
                <instancedMesh castShadow receiveShadow args={[null, null, cubesCount]} ref={cubesRef}>
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />
                </instancedMesh>
            </InstancedRigidBodies>

        </Physics>

    </>
}