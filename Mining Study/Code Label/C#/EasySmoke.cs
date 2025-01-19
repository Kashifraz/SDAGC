using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

// This file was written with mostly copilot

public class EasySmoke : MonoBehaviour
{   // declare the player so we can increase the total time in the smoke
    public PickupItem Player;

    // declare the total time needed for the smoke to reach the ground
    public float totalTime = 1.0f;

    // declare the amount of distance the smoke will travel
    public float distance = 1.0f;

    // declare the amount of smoke the player can breathe without dying
    public float maxBreath = 10.0f;

    // declare a private field to store the current amount of air the player has, and make it visible in the inspector
    [SerializeField]
    private float currentBreath = 0.0f;

    // declare a private field to store whether or not the player is currently in the smoke
    private bool inSmoke = false;

    // declare a private field to set the speed of the smoke
    private float speed = 0.0f;

    // declare a public Image for the image overlay
    public Image smokeOverlay;

    // declare the public field for the color of the smoke 
    public Color smokeColor = Color.white;
    // declare the public field for the color of the damage effect 
    public Color damageColor = Color.red;

    // declare a public interval for the damage effect
    public float damageInterval = 0.1f;

    // declare a public field for the length of the damage effect
    public float damageLength = 0.5f;

    // declare a private field to store the current time of the damage effect
    private float currentDamageTime = 0.0f;

    // declare a private field to track whether or not we have flashed the damage effect
    private bool damageFlashed = false;


    public AudioSource PlayerAudio;
    public int DamageSoundInterval;
    public AudioClip[] DamageSounds;
    private int currentDamageSoundInterval;

    // Start is called before the first frame update
    void Start()
    {
        // set the current breath to the max breath
        currentBreath = maxBreath;

        // enable the renderer of the smoke
        GetComponent<Renderer>().enabled = true;

        // set the speed of the smoke to the distance divided by the total time
        speed = distance / totalTime;

        // set the color of the smoke overlay to the smoke color
        smokeOverlay.color = smokeColor;

        // find the player
        Player = GameObject.FindGameObjectWithTag("Player").GetComponent<PickupItem>();

        PlayerAudio = Player.GetComponent<AudioSource>();

        currentDamageSoundInterval = DamageSoundInterval - 1;
    }

    // Update is called once per frame
    void FixedUpdate()
    {
        // if the player is in the smoke, decrease the current breath by the time
        if (inSmoke)
        {
            if (currentDamageTime < damageInterval)
            {
                if (damageFlashed && currentDamageTime > damageLength)
                {
                    damageFlashed = false;
                    smokeOverlay.color = smokeColor;
                }
                currentDamageTime += Time.deltaTime;
                Player.SmokeTime += Time.deltaTime;
            }
            else
            {
                currentDamageTime = 0;
                smokeOverlay.color = damageColor;
                damageFlashed = true;
                if (++currentDamageSoundInterval >= DamageSoundInterval)
                {
                    currentDamageSoundInterval = 0;
                    if (DamageSounds.Length > 0)
                    {
                        PlayerAudio.PlayOneShot(DamageSounds[Random.Range(0, DamageSounds.Length)]);
                    }
                    else
                    {
                        Debug.LogWarning("There are no damage sounds assigned to EasySmoke component on " + gameObject.name);
                    }
                }
            }


            currentBreath -= Time.deltaTime;
            // if the current breath is less than 0, the player is dead
            if (currentBreath <= 0.0f)
            {
                GameData.DeathType = 1;
                // disable the renderer of the smoke
                GetComponent<Renderer>().enabled = false;
                // disable the script
                enabled = false;

                UnityEngine.SceneManagement.SceneManager.LoadScene("DeathScene");
            }
        }
        else if (currentBreath < maxBreath)
        {
            // if the player is not in the smoke, increase the current breath by the time
            currentBreath += Time.deltaTime;
        }

        // move the smoke downwards at the speed calculated
        transform.Translate(Vector3.down * speed * Time.deltaTime);
    }

    void OnTriggerEnter(Collider other)
    {
        // if the smoke hits the player
        if (other.gameObject.tag == "Player")
        {
            // set the inSmoke field to true
            inSmoke = true;

            // activate the smoke overlay
            smokeOverlay.enabled = true;

            // get the tears component of the player and set tearing to true
            other.gameObject.GetComponent<Tears>().tearing = true;

            // Log that the player has entered the smoke
            Debug.Log("Entered the smoke");
        }
    }

    void OnTriggerExit(Collider other)
    {
        // if the smoke leaves the player
        if (other.gameObject.tag == "Player")
        {
            // set the inSmoke field to false
            inSmoke = false;

            // deactivate the smoke overlay
            smokeOverlay.enabled = false;

            // get the tears component of the player and set tearing to false
            other.gameObject.GetComponent<Tears>().tearing = false;

            currentDamageSoundInterval = DamageSoundInterval - 1;

            // log that the player has left the smoke
            Debug.Log("Left smoke");
        }
    }
}
