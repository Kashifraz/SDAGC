using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using UnityEngine.Assertions;
using TMPro;
using Unity.VisualScripting;
using System.Linq;
using System;

public class OpenCVManager2 : MonoBehaviour
{
    private const string LIBRARY_NAME = "ArucoBridgeLibC";

    [DllImport(LIBRARY_NAME)]
    private static extern void InitOpenFrame(int width, int height);

    [DllImport(LIBRARY_NAME)]
    private static extern void GetFeatures(ref Color32[] rawData);

    [DllImport(LIBRARY_NAME)]
    private static extern int GetArucoDrawing(ref Color32[] rawImage);

    private bool _camAvailable;
    private WebCamTexture _camera;
    [SerializeField]
    private GameObject _videoBackgroundQuad;
    private Texture2D _videoBackgroundTexture;
    [SerializeField]
    private Camera _mainCamera;


    // Start is called before the first frame update
    void Start()
    {

        //The Camera Setup was inspired by the following tutorial
        //https://www.youtube.com/watch?v=c6NXkZWXHnc
        WebCamDevice[] devices = WebCamTexture.devices;

        //No Camera Found
        if (devices.Length == 0)
        {
            Debug.Log("No camera detected");
            _camAvailable = false;
            return;
        }

        //assign back camera as the main camera
        for (int i = 0; i < devices.Length; i++)
        {
            //Back Camera
            if(devices[i].isFrontFacing) continue;

            _camera = new WebCamTexture(devices[i].name, Screen.width, Screen.height);
        }

        //No camera found
        if (_camera == null)
        {
            Debug.Log("Unable to find back camera");
            return;
        }

        _camera.Play();
        _camAvailable = true;

        _videoBackgroundTexture = new Texture2D(_camera.width, _camera.height);
        _videoBackgroundQuad.GetComponent<MeshRenderer>().material.mainTexture = _videoBackgroundTexture;

        float z = 10.0f;	
        float sizeX = _camera.width * 0.001f;   //Millimeters to meters
        float sizeY = _camera.height * 0.001f;
        _videoBackgroundQuad.transform.localPosition = new Vector3(0.0f, 0.0f, z);
        _videoBackgroundQuad.transform.localScale = new Vector3(sizeX * z, sizeY * z, 1.0f);


        InitOpenFrame(_camera.width, _camera.height);
    }

    // Update is called once per frame
    void Update()
    {
        Color32[] rawColors = _camera.GetPixels32();


        //Mirror Image Horizontally
        mirrorImageHoroizontally(rawColors);

        //Saving values for asserts
        int beforeLength = rawColors.Length;
        Color32 beforeColor = rawColors[200];


        //Call to OpenCV
        int returnValue = GetArucoDrawing(ref rawColors);
        Debug.Log("Return Value: " + returnValue);


        //Asserts
        Assert.AreEqual(beforeLength, rawColors.Length);
        Assert.AreEqual(beforeColor, rawColors[200]);

        //Mirror Image Horizontally
        mirrorImageHoroizontally(rawColors);


        _videoBackgroundTexture.SetPixels32(rawColors);
        _videoBackgroundTexture.Apply();
    }


    //Generated by Github Copilot
    private void mirrorImageHoroizontally(Color32[] rawColors)
    {
        int width = _camera.width;
        int height = _camera.height;

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width / 2; x++)
            {
                Color32 temp = rawColors[y * width + x];
                rawColors[y * width + x] = rawColors[y * width + (width - 1 - x)];
                rawColors[y * width + (width - 1 - x)] = temp;
            }
        }
    }

}
