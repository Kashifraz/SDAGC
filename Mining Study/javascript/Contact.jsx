import React, { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { TextureLoader } from "three";

export default function Contact() {
  const { setCameraAnimation, cameraAnimation, cameraPositions } = useScene();

  useEffect(() => {
    // Animate to the work state
    setCameraAnimation("contact");
  }, [setCameraAnimation]);

  useFrame(({ camera }) => {
    // Update camera position using interpolation
    const { position, lookAt } = cameraPositions[cameraAnimation];
    camera.position.lerp(new THREE.Vector3(...position), 0.08);

    //At first my camera rotation code: camera.lookAt(lookAt)
    //Then: camera.lookAt(new THREE.Vector3(...lookAt));
    //OpenAI GPT-3.5 (2023). AI-Generated Code Snippet for camera rotation. (Accessed: December 15, 2023)

    // Calculate the current direction the camera is facing
    const currentDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion
    );
    // Calculate the target direction the camera should face
    const targetDirection = new THREE.Vector3()
      .subVectors(lookAt, camera.position)
      .normalize();
    // Interpolate between the current and target directions
    const newDirection = currentDirection.lerp(targetDirection, 0.05);
    // Calculate the new quaternion based on the interpolated direction
    const newQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      newDirection
    );
    // Slerp to the new quaternion
    camera.quaternion.slerp(newQuaternion, 0.5);
  });

  const github = useLoader(TextureLoader, "./visuals/github.png");
  const linkedin = useLoader(TextureLoader, "./visuals/linkedin.png");

  return (
    <>
      <Html position={[-1, 5.26, -3.41]} rotation-x={Math.PI * 0.5}>
        <form id="contact">
          <p>
            Hey, if you are interested to get in touch,
            <br /> please fill out this form.
            <br />I am excited to here from you!
          </p>

          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              name="name"
              placeholder="(Your name ...)"
              required
            />
          </label>

          <label htmlFor="email">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              placeholder="(Your email address ...)"
              required
            />
          </label>
          <label htmlFor="message">
            Message:
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="(Any message (questions, inqueries, ...))"
              required
            ></textarea>
          </label>
          <button type="button">Submit</button>
        </form>
      </Html>

      {/*Click on images to acces linkedin and github account */}
      <mesh
        onClick={(event) =>
          (window.location.href = "https://github.com/danavolovelsky")
        }
        position={[1.94, 5.26, -2.45]}
        rotation-x={Math.PI * 1.5}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={github} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        onClick={(event) =>
          (window.location.href = "https://www.linkedin.com/in/dana-volovelsky")
        }
        position={[1.94, 5.26, -1.45]}
        rotation-x={Math.PI * 1.5}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={linkedin} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
