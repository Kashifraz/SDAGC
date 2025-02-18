import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from itertools import combinations

# Set2 was used before
sns.set_theme(context="paper", font_scale=1.5, style="whitegrid", palette="RdGy")

detail = {"age": "Age", "sex": "Sex", "cp": "Chest Pain Type", "trestbps": "Resting Blood Pressure",
          "chol": "Serum Cholesterol", "fbs": "Fasting Blood Sugar", "restecg": "Resting ECG",
          "thalach": "Max Heart Rate", "exang": "Exercise Induced Angina", "oldpeak": "Oldpeak",
          "slope": "Slope", "ca": "Number of major vessels", "thal": "Thal", "target": "(0 - no disease, 1 - disease))"}

numericFeatures = ["age", "trestbps", "chol", "thalach", "oldpeak", "ca"]
categoricalFeatures = ["sex", "cp", "fbs", "restecg", "exang", "slope", "thal"]

data = pd.read_csv("heart.dat", sep="\\s+", header=None)
data.columns = detail.keys()
# print(data.describe())
# print(data.head())

# TARGET
'''
feature = "target"
plt.figure()
sns.countplot(data=data, x=feature, hue="target")
plt.title(f"{detail[feature]} VS Target")
# plt.savefig(f"plots/{feature}_count.png")
'''


data["sex"] = data["sex"].replace({0: "female", 1: "male"})
data["target"] = data["target"].replace({1: "no disease", 2: "disease"})

# NUMERICAL
'''
for feature in numericFeatures:
    plt.figure()
    sns.kdeplot(data=data, x=feature, fill=True)
    plt.title(f"{detail[feature]} Density")
    # plt.savefig(f"plots/numeric/kde1000/{feature}_kde1000.png")

for feature in numericFeatures:
    plt.figure()
    sns.histplot(data=data, x=feature, fill=True)
    plt.title(f"{detail[feature]} Histogram")
    # plt.savefig(f"plots/numeric/hist/{feature}_hist.png")

# Real vs. Real
for feature1, feature2 in combinations(numericFeatures, 2):
    plt.figure()
    sns.relplot(    
            data=data, x=feature1, y=feature2,
            hue="target"
    )
    # plt.savefig(f"plots/numeric/num_vs_num/{feature1}Vs{feature2}.png")
'''


# CATEGORICAL

# Feature VS Target Counts
for feature in categoricalFeatures:
    plt.figure()
    sns.countplot(data=data, x=feature, hue="target")
    plt.title(f"{detail[feature]} VS Target")
    # plt.savefig(f"plots/categorical/default/{feature}VsTarget.png")

# Normalized Feature VS Target Counts
for feature in categoricalFeatures:
    # thanks copilot
    
    # count unique target values for each class in each feature and normalize them
    proportions = data.groupby(feature)["target"].value_counts(normalize=True).rename("proportion").reset_index()
    plt.figure()
    sns.barplot(data=proportions, x=feature, y="proportion", hue="target")
    plt.title(f"Normalised {detail[feature]} VS Target")
    # plt.savefig(f"plots/categorical/normalized/{feature}VsTarget_normalized.png")



# MOSAICS
'''
no_col = 10
cmaps = ("crest", "YlOrBr", "Oranges", "rocket", "flare")
mosaic = pd.DataFrame(data=[np.random.random(no_col) for x in range(100)], columns=[x for x in range(no_col)])

# print(data_default.head())
plt.figure(figsize=(13, 10))

for i in range(5):
    plt.figure()
    sns.heatmap(mosaic.corr(), annot=False, linewidths=2, cmap=cmaps[i])
    plt.savefig(f"plots/oneHot_heatmap{i}.png")
plt.show()
'''


# histogram is for continuous non categorical feature