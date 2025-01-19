# Purpose: Join multiple WAV files into one WAV file with silence between each WAV file.
# thanks to ChatGPT and GitHub copilot
# thanks to https://stackoverflow.com/questions/2890703/how-to-join-two-wav-files-using-python
# thanks to https://stackoverflow.com/questions/10357992/how-to-generate-audio-from-a-numpy-array
# todo: https://stackoverflow.com/questions/18625085/how-to-plot-a-wav-file

import wave
import numpy as np

def join_wav_files(wav_files):
    # Check if there are any WAV files
    if not wav_files:
        print("No WAV files found.")
    else:
        # Create silence
        sample_rate = 44100  # Adjust the sample rate as needed
        duration = 4.0  # Duration of silence in seconds
        num_frames = int(sample_rate * duration)
        silence_data = np.zeros(num_frames, dtype=np.int16)

        data = []
        for wav_file in wav_files:
            w = wave.open(wav_file, 'rb')

            # Append silence to the data
            data.append([w.getparams(), w.readframes(w.getnframes())])
            data.append([(w.getparams()[0], 2, w.getparams()[2], w.getparams()[3], 'NONE', 'not compressed'), silence_data.tobytes()])

            w.close()

        if data:
            # Output file name
            outfile = "output.wav"

            output = wave.open(outfile, 'wb')
            output.setparams(data[0][0])
            for i in range(len(data)):
                output.writeframes(data[i][1])
            output.close()
            print(f"Output saved as {outfile}")
        else:
            print("No valid WAV data found in the input files.")

if __name__ == '__main__':
    import os
    import random
    import glob
    from folders import dapa_ap_wav_folder

    # Use glob to get a list of all WAV files in the folder
    wav_files = glob.glob(os.path.join(dapa_ap_wav_folder(), '*.wav'))
    # random.shuffle(wav_files)
    # with open('output_microsoft.txt', 'w') as text_file:
    #     # Write each file name on a separate line
    #     for wav_file in wav_files:
    #         text_file.write(wav_file + '\n')

    join_wav_files(wav_files)