using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Cinemachine;
using System;
using StarterAssets;

public class ZipAdvancePlayer : MonoBehaviour
{// Component of PlayerArmature    // written by ChatGPT with about 8 prompts over about an hour  & a week fix many issues and get working 

    public float raycastDistance = 100.0f;
    public float raycastInterval = 1.0f;
    public float transformTranslateDelay = .5f;
    public float adjustedZipDistance = 8f; // to avoid overshooting crossHair and prevent entering/going thru walls 
    public bool noColliderInFront = false; // Set to true if no collider in front
    public bool debugDistance = false;
    public Button zipButton; // Reference to the "ZIP->" button
    public CanvasGroup buttonCanvasGroup; // Reference to the button's CanvasGroup
    public CinemachineVirtualCamera followCamera;
    public GameObject crossHair;
    //private CharacterController characterController;
    public PlayerEnteredRelevantTrigger setCamAndPlayerAngle;
    CinemachineBrain cinemachineBrain;
    bool startRan, playerIsZipping;
    float zipDistance;
    float originalTopClamp; //set to +45f so player can look down if "flying" - about 10 units +Y  
    Vector3 rayOriginFixedHeight, crossHairPosition;
    AudioManager audioManager;
    //ThirdPersonController thirdPersonController;

    private void OnEnable()
    {
        //if (thirdPersonController == null) Debug.LogError("thirdPersonController is null.");   //not if Player is disabled !!!
        //else Debug.Log("thirdPersonController is NOT Null");
        //if (!startRan)
        //{
        //    originalTopClamp = thirdPersonController.TopClamp;
        //}

        if (startRan) Start();
        //Debug.Log("RayCasting enabled OnEnable ....");
    }

    private void Start()
    {
        // Get the CinemachineBrain component attached to the camera
        cinemachineBrain = Camera.main.GetComponent<CinemachineBrain>();
        if (!audioManager) audioManager = GameObject.Find("Audio Manager").GetComponent<AudioManager>();
        startRan = true;
        Debug.Log("RayCasting enabled in START()....");
        // Get the CharacterController component
       // characterController = GetComponent<CharacterController>();

        // Get a reference to the "ZIP->" button
        if (!zipButton) zipButton = GameObject.Find("ZipButton").GetComponent<Button>();
        Debug.Log("Did a find on ZipButton...." + zipButton.name);
        buttonCanvasGroup = zipButton.GetComponent<CanvasGroup>();
        buttonCanvasGroup.alpha = 0; // Hide the button by default

        // Add an onClick listener to the button
        zipButton.onClick.AddListener(OnZipButtonClick);

        crossHairPosition = followCamera.transform.position;

        // Start the coroutine to perform raycasts at intervals
        StartCoroutine(RaycastCoroutine());
        Debug.Log("ZipAdvancePlayer started coroutine");
    }

    private void OnZipButtonClick()
    {
        if (buttonCanvasGroup.alpha == 0) return;
        {
            buttonCanvasGroup.alpha = 0;
            zipButton.gameObject.SetActive(false);
            if (!playerIsZipping) StartCoroutine (ZipPlayerForward());
            // Hide the button again
           // buttonCanvasGroup.alpha = 0;   //moved 2 b 4 coroutine 
        }
    }

    private IEnumerator RaycastCoroutine()
    {
        while (true)
        {
            buttonCanvasGroup.alpha = 0;   //10/8/23 In case the button is ON -- SetActive(false) instead? - we'll see 
            bool followCamIsLive = cinemachineBrain.IsLive(followCamera);
            if (followCamIsLive)  //10/4/23  only do if cam is live 
            {

                // Calculate the ray's origin and direction from the Cinemachine camera
                float minRay = 0;
                Vector3 halfHeightOfCamera = new Vector3(0f, followCamera.transform.position.y / 2, 0f);
                Vector3 rayOrigin = followCamera.transform.position - halfHeightOfCamera;
                Vector3 rayDirection = new Vector3(followCamera.transform.forward.x, 0, followCamera.transform.forward.z);
                if (debugDistance) Debug.Log("rayDirection = " + rayDirection);
                //Debug.Log("rayDirection = " + rayDirection);
                rayOriginFixedHeight = new Vector3(rayOrigin.x, transform.position.y + 2, rayOrigin.z);
                // Perform the raycast
                if (Physics.Raycast(rayOriginFixedHeight, rayDirection, out RaycastHit hit, raycastDistance))
                {
                    // A collider was hit   10 is cam 5f behind player + 5f for minimum zipable  
                    if (hit.distance <= 10f)
                    {
                        zipButton.gameObject.SetActive(false); //disable the button 
                        buttonCanvasGroup.alpha = 0; // Hide the button
                        crossHair.SetActive(false);
                    }
                    if (hit.distance > 10f)  // we can enable zipping
                    {
                        if (!crossHair.activeSelf) crossHair.SetActive(true);
                        buttonCanvasGroup.alpha = 1; // Show the button
                        zipButton.gameObject.SetActive(true);  //enable the button
                        zipDistance = hit.distance - adjustedZipDistance;  //raycastDistance less (distance from cam + 3f buffer )
                        if (debugDistance) Debug.Log("Distance to collider: " + hit.distance + "  hit " + hit.collider);
                        crossHair.transform.position = hit.point;
                    }
                }
                else   // No collider hit  - So set zipDistance to the entire raycastDistance// maybe less (distance from cam + 3f buffer )
                {
                    if (!crossHair.activeSelf) crossHair.SetActive(true);
                    // crossHair.transform.position = followCamera.transform.position + followCamera.transform.forward * raycastDistance;
                    crossHair.transform.position = followCamera.transform.position + rayDirection * raycastDistance;
                    zipDistance = raycastDistance - adjustedZipDistance;
                    buttonCanvasGroup.alpha = 1; // Show the button
                    zipButton.gameObject.SetActive(true); //enable the button
                }
                minRay = Math.Max(hit.distance, raycastDistance);
                //Debug.DrawRay(rayOriginFixedHeight, followCamera.transform.TransformDirection(Vector3.forward) * minRay , Color.yellow, raycastInterval -.5f);
                Debug.DrawRay(rayOriginFixedHeight, rayDirection * minRay, Color.yellow, raycastInterval / 2f);

                //if (thirdPersonController)   //caused stutter? probably not 
                //{
                //    if (transform.position.y > 9)
                //    {
                //        thirdPersonController.TopClamp = 45f;
                //    }
                //    else thirdPersonController.TopClamp = originalTopClamp;
                //}
            }
            yield return new WaitForSeconds(raycastInterval);   //try return null ? maybe better and less GC
           // yield return null;   //try return null ? maybe better and less GC ? are we now raycasting every frame? cost?
                                                                //
        }
    }
    private IEnumerator ZipPlayerForward()
    {
        //Debug.Log("transform.Translate(Vector3.forward *  zipDistance  + " + zipDistance + "  logRayOrigin = " + rayOriginFixedHeight);
        playerIsZipping = true;
        transform.rotation = Quaternion.Euler(0f, followCamera.transform.eulerAngles.y, 0.0f);  //10/5/23
        setCamAndPlayerAngle.Invoke(followCamera.transform.eulerAngles.y, true);    //BK 9/4/23 if this works we can just call move once?
                                                                                    // 10/3/23 added bool,  NOT used for now
        yield return new WaitForSeconds(transformTranslateDelay); //try eoframe
        //yield return new WaitForEndOfFrame();    //
        audioManager.PlayAudio(audioManager.WHOOSH);
        transform.Translate(Vector3.forward * zipDistance);
        playerIsZipping = false;
    }
    private void OnDrawGizmos()
    {
        // Draw a raycast Gizmo from the GameObject's position
        Gizmos.color = Color.red;
        Vector3 rayDirection = new Vector3(followCamera.transform.forward.x, 0, followCamera.transform.forward.z);
        Gizmos.DrawRay(rayOriginFixedHeight, rayDirection * raycastDistance);
    }
    private void OnDisable()
    {
       // Debug.Log("RayCasting DISABLED OnDisable....");
        StopAllCoroutines();
    }
}


// 7 lines cut from OnZipButtonClick()
//var pRot = transform.rotation;
//var cRot = followCamera.transform.rotation;
//var peRot = transform.eulerAngles;
//var ceRot = followCamera.transform.eulerAngles;
//Debug.Log("pRot = " + pRot + "  cRot = " + cRot);
//Debug.Log("peRot = " + peRot + "  ceRot = " + ceRot);
//  transform.eulerAngles = followCamera.transform.eulerAngles;

/*  before delete comments on 9/5/23
 *     private IEnumerator ZipPlayerForward()
    {
        //setCamAngle.Invoke(followCamera.transform.eulerAngles.y);
        //yield return new WaitForSeconds(3f);
        //// Move the player forward by x meters

        //characterController.Move(followCamera.transform.forward * .2f);
        Debug.Log("transformForward * 4 is  = " + followCamera.transform.forward *4);
        setCamAndPlayerAngle.Invoke(followCamera.transform.eulerAngles.y);    //BK 9/4/23 if this works we can just call move once?
        yield return new WaitForSeconds(transformTranslateDelay);
        // Move the player forward by x meters
       // characterController.Move(followCamera.transform.forward * 4f);
        transform.Translate(Vector3.forward * 4);
    }
 */