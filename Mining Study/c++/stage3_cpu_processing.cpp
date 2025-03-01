/**
 * @file stage3_cpu_processing.cpp
 * @author Riley
 * @brief Perform stage 3 of the PLSA pipeline. Here, we use the EM algorithm to derive our model.
 * @version 1.0
 * @date 2023-04-12
 * 
 * @copyright Copyright (c) 2023. Licensed under CC-BY-SA.
 * 
 */

// C headers
#include <stdio.h>
#include <stdlib.h>

// C++ headers
#include <cstddef>
#include <iostream>

// Local headers
#include "stage3/emStep.h"
#include "stage3/modelData.h"

using std::cerr;
using std::cout;
using std::endl;

#define MAXITER 100

ModelData loadModelFromFile() {
    // Load the counts and background LM from file.
    FILE *count_file = fopen("model/counts.bin", "rb");

    if (!count_file) {
        cerr << "Unable to open counts file. Please check your data." << endl;
        exit(-1);
    }

    // The first 2 entries
    size_t *count_data = new size_t[2];
    fread(count_data, sizeof(size_t), 2, count_file);

    ModelData model = ModelData(count_data[0], count_data[1]);

    delete[] count_data;

    cout << "Detected " << model.document_count << " documents and " << model.vocab_size << " words. Loading background LM..." << endl;

    fread(model.document_counts, sizeof(size_t), model.vocab_size * model.document_count, count_file);
    fclose(count_file);

    FILE *background_lm_file = fopen("model/bg.bin", "rb");

    if (!background_lm_file) {
        cerr << "Unable to open background LM file. Please check your data." << endl;
        exit(-1);
    }

    fread(model.background_lm, sizeof(size_t), model.vocab_size, background_lm_file);
    fclose(background_lm_file);

    cout << "File loading completed. Proceeding to computation phase." << endl;

    return model;
}

// Save the EM results to files. Generated by ChatGPT.
void saveEmToFile(const EMstep &data) {
    // Open files
    FILE *doc_file = fopen("model/document_coverage.bin", "wb+");
    FILE *topic_file = fopen("model/topic_models.bin", "wb+");

    // Write num_topics, num_documents, and vocab_size to topic file
    fwrite(&data.num_topics, sizeof(size_t), 1, topic_file);
    fwrite(&data.num_documents, sizeof(size_t), 1, topic_file);
    fwrite(&data.vocab_size, sizeof(size_t), 1, topic_file);

    // Write document_coverage to file
    fwrite(data.document_coverage, sizeof(double), data.num_topics * data.num_documents, doc_file);

    // Write topic_models to file
    fwrite(data.topic_models, sizeof(double), data.num_topics * data.vocab_size, topic_file);

    // Close files
    fclose(doc_file);
    fclose(topic_file);

    cout << "Saved models to files. Stage 3 completed." << endl;
}


EMstep runEm(ModelData &model, size_t num_topics, double prob_of_bg) {
    // Double buffering!
    EMstep first = EMstep(num_topics, model.document_count, model.vocab_size);
    EMstep second = EMstep(num_topics, model.document_count, model.vocab_size);
    
    first.genrandom();

    bool update_first = false;

    double *P_zdw_B = new double[model.document_count * model.vocab_size];
    double *P_zdw_j = new double[model.document_count * model.vocab_size * num_topics];

    for (size_t i = 0; i < MAXITER; i++) {
        // This takes 42s per iteration, assuming 500 books
        if (update_first) {
            cpuUpdate(first, second, model, prob_of_bg, P_zdw_B, P_zdw_j);
        } else {
            cpuUpdate(second, first, model, prob_of_bg, P_zdw_B, P_zdw_j);
        }

        cout << "Iteration number: " << i << endl;

        if (isConverged(first, second)) {
            if (update_first) {
                return first;
            } else {
                return second;
            }
        }

        update_first = !update_first;
    }

    delete[] P_zdw_B;
    delete[] P_zdw_j;

    cout << "Completed EM phase. Saving results to file..." << endl;
    return first;
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        cerr << "Usage: " << argv[0] << " [num_topics] [background probability]" << endl;
        exit(-1);
    }

    ModelData model = loadModelFromFile();

    unsigned int num_topics = atoi(argv[1]);
    float bg_prob = atof(argv[2]);

    EMstep output = runEm(model, num_topics, bg_prob);

    // Save output to file
    saveEmToFile(output);
}