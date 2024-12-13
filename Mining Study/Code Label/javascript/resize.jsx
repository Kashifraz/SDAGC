import { useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import * as THREE from "three";

// Changing camera field of view for responsive design
const Resize = () => {
  const { set } = useThree(); //Accessing three.js context

  //Initial camera reference
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );

  //update camera settings on window size
  const updateCamera = () => {
    const { innerWidth: width, innerHeight: height } = window; // getting width and height
    const aspectRatio = width / height; //calculating aspect ratio
    const fov = calculateFov(width); //Calculating fov based on width

    //Update camera properties
    cameraRef.current.fov = fov;
    cameraRef.current.aspect = aspectRatio;
    cameraRef.current.updateProjectionMatrix();

    //updating camera in three.js context
    set((state) => ({
      ...state,
      camera: cameraRef.current,
    }));
  };

  //OpenAI GPT-3.5 (2023). AI-Generated Code Snippet for keeping track of camera (Accessed: January 21, 2024)
  useEffect(() => {
    // Initial setup of the camera
    updateCamera();

    // Event listener for window resize
    window.addEventListener("resize", updateCamera);

    // Clean up function to prevent memory leaks, so that updatecamera function wont be called unnecessarily
    return () => {
      window.removeEventListener("resize", updateCamera);
    };
  }, [set]); //effect is only re-run if the set function reference changes

  return null;
};

// Function to calculate FOV
const calculateFov = (width) => {
  console.log("Window width:", width);

  if (width <= 768) {
    // Mobile devices
    return 110;
  } else if (width <= 1400) {
    // Tablets
    return 100;
  } else {
    // Laptops and larger
    return 75;
  }
};

export default Resize;
