import sys
import os
from pandas import read_csv, DataFrame
from numpy import tile, arange, exp
from math import log, comb
from random import shuffle, uniform
from collections import deque 
from time import perf_counter, sleep

# %% Helper Functions

'''
###############################################
HELPER FUNCTIONS
###############################################
'''
# The function debug_print(message, variable, bool): prints a variable for debug tracing
# def debug_print(message: str, variable, debug_flag: bool):
#     if debug_flag == True:
#         print(f"debug tracing : {message} : {variable}")

# debug_flag = True

def csvCheck(file_path):
    _, file_extension = os.path.splitext(file_path)
    return file_extension.lower() == ".csv"

def calculateDiversity(dataframe, subset):
    
    # initialise group_unique_count to store the unique counts of items in each column
    group_unique_count = {}
    
    row_total_count = len(dataframe)
    column_total_count = len(dataframe.columns)
    subset_unique_value_count = subset.nunique()
    total_count_N = row_total_count
    shannon_weiner_index = 0
    
    for column in range(column_total_count):
        unique_count_n = subset_unique_value_count.iloc[column]
        column_name = dataframe.columns[column]
        group_unique_count[column_name] = unique_count_n        
    # debug_print("column_total_count", column_total_count, debug_flag)
        
    for column in range(column_total_count):
        column_name = dataframe.columns[column]
        n = group_unique_count[column_name]
        # debug_print("n", n, debug_flag)
        # debug_print("N", total_count_N, debug_flag)
      
        p_i = n / total_count_N
        shannon_weiner_index += (p_i * log(p_i))
        shannon_weiner_index = -(shannon_weiner_index)
    return shannon_weiner_index

def assigner(num_groups, num_rows, data):
    
    BOLTZMANN_CONSNTANT = 1.380649e-23
    
    # Initialise the initial assignment participants distributed evenly among groups
    assignment = tile(arange(1, num_groups + 1), num_rows // num_groups + 1)[:num_rows] 
    data['assigned_group'] = assignment
    
    # Initialise variable to store total diversity 
    diversity_sum = 0
    
    # Initialise dict to store diversity for each group
    dict_diversity_store = {}
    for i in range(1, num_groups + 1):
        # debug_print("i group", i, debug_flag)
        subset = data.loc[data['assigned_group'] == i]
        dict_diversity_store[i] = calculateDiversity(data, subset)
    # debug_print("dict_diversity_store", dict_diversity_store, debug_flag)
    
    for value in dict_diversity_store.values():
        diversity_sum += value
    
    initial_diversity = diversity_sum
    current_diversity = initial_diversity
    # debug_print("initial diversity", current_diversity, debug_flag)
    
    # Intermediary check for future debugging
    # if debug_flag:
    #     data.to_csv('PreAssignIndexedDataV0_2_3a.csv', index = True)
    
    # Initialise tracking buffer to check whether a progress milestone has reached.
    buffer_progress = 0
    
    # Define the initial temperature for simulated annealing
    initial_temperature = 1.0
    temperature = initial_temperature
    
    while temperature > 0.001:
        # Generate a random sequence of indices to pop. Use deque()
        indices_lst = [i for i in range(num_rows)]
        shuffle(indices_lst)
        indices_lst = deque(indices_lst)
        
        # deque size
        indices_lst_size = len(indices_lst)
        initial_indices_lst_size = indices_lst_size 
        
        # Flag for whether to skip last row, based on even or odd index.
        # If there are odd number of rows, ignore the last row since there is no row to swap with.
        if (num_rows % 2) > 0:
            num_rows_even_capped = num_rows - 1
        else:
            num_rows_even_capped = num_rows
        # debug_print("indices_lst", indices_lst, debug_flag)
        
        # Iniialise a tracker, using set. Used in 'for' loop in data.iterrows(). 
        # If index has already been swapped, this variable is used to identify the index to skip.
        previous_index = set()
        
        # Group assignment, using iterrows() for iteration. Algorithm: simulated annealing
        for index, i in data.iterrows():
            while True:
                # update deque size
                indices_lst_size = len(indices_lst)
                
                # stop swaps when the deque is empty
                if indices_lst_size == 0:
                    break
                
                # debug_print("iterrows index", index, debug_flag)    
                assign_i = data.at[index, 'assigned_group']
                pointer = indices_lst[0]
                assign_j = data.at[pointer, 'assigned_group']
                
                # If the index has already swapped, skipped swapping
                if index in previous_index: 
                    break
                
                # Cap the swaps to the last even index
                elif index == num_rows_even_capped:
                    break 
    
                # Prevent self-swapping or row swapping within the same group 
                # Move the pointer's value to the end of the deque 
                elif indices_lst[0] == index or assign_i == assign_j:
                    indices_lst.popleft()
                    indices_lst.append(pointer)
                    break
    
                else:    
                    # take snapshots of assignment and group-level diversity before swap
                    snapshot_i = assign_i
                    snapshot_j = assign_j
                    # debug_print("assign_i", assign_i, debug_flag)
                    # debug_print("assign_j", assign_j, debug_flag)
                    # debug_print("snapshot_i", snapshot_i, debug_flag)
                    # debug_print("snapshot_j", snapshot_j, debug_flag)
                    
                    # Initialise buffer dictionary to temporarily store previous diversity of the 2 groups. (Before the 2 groups had a row swapped)
                    dict_snapshot_diversity_store = {}
                    dict_snapshot_diversity_store[snapshot_i] = dict_diversity_store[assign_i]
                    dict_snapshot_diversity_store[snapshot_j] = dict_diversity_store[assign_j]
                    
                    # swap group assignments
                    indices_lst.popleft()
                    data.at[index, 'assigned_group'] = snapshot_j
                    data.at[pointer, 'assigned_group'] = snapshot_i     
                    subset_i = data.loc[data['assigned_group'] == assign_i]
                    subset_j = data.loc[data['assigned_group'] == assign_j]
                    
                    # Calculate the change in diversity
                    snapshot_diversity = current_diversity
                    new_diversity = current_diversity - dict_snapshot_diversity_store[assign_i] - dict_snapshot_diversity_store[assign_j]
                    
                    dict_diversity_store[assign_i] = calculateDiversity(data, subset_i)
                    dict_diversity_store[assign_j] = calculateDiversity(data, subset_j)
                    
                    new_diversity = new_diversity + dict_diversity_store[assign_i] + dict_diversity_store[assign_j]
                     
                    delta_diversity = new_diversity - current_diversity
                    # debug_print("delta_diversity", delta_diversity, debug_flag)
                    
                    # Accept the new assignment based if there is increased diversity. 
                    # There is a proability to reject this swap.
                    # If rejected, repeat this inner 'while' loop, use the next index in the deque
                    if delta_diversity > 0:
                        current_diversity = new_diversity
                        previous_index.add(index)
                        break
                        
                    else:
                        if uniform(0,indices_lst_size) < exp(delta_diversity / (BOLTZMANN_CONSNTANT * temperature)): 
                            # revert the swap to snapshots
                            data.at[index, 'assigned_group'] = snapshot_i
                            data.at[pointer, 'assigned_group'] = snapshot_j
                            dict_diversity_store[assign_i] = dict_snapshot_diversity_store[snapshot_i]
                            dict_diversity_store[assign_j] = dict_snapshot_diversity_store[snapshot_j]
                            # Move the pointer's value to the end of the deque 
                            indices_lst.append(pointer)
                            current_diversity = snapshot_diversity
                            break
                
            # Update temperature (cooling rate) based on the remaining size of the deque.
            size = lambda x: (initial_indices_lst_size - x)
            if size(indices_lst_size) == 0:
                cooling_rate = size(indices_lst_size - 1) / initial_indices_lst_size
            else:
                cooling_rate = size(indices_lst_size) / initial_indices_lst_size
            temperature *= cooling_rate
            
            # print the progress
            progress = (1 - temperature) * 100
            stepped_progress = (progress // 1) % 10
            if buffer_progress != round(progress) and stepped_progress == 0:
                print(f"Progress on current solution {progress: .0f}%")
            buffer_progress = round(progress)
            # debug_print("current_diversity", current_diversity, debug_flag)
            # debug_print("temperature", temperature, debug_flag)
            # debug_print("Progress percentage of current solution:", (1 - temperature), debug_flag)
    
    # Intermediary check for future debugging
    # if debug_flag:
    #     data.to_csv("AssignerOutputV0_2_3a.csv")
    
    return data, initial_diversity, current_diversity

# Stopwatch program. Used in estimating compute time. Credit: Mostly AI-generated
class Stopwatch:
    def __init__(self):
        self.start_time = None
        self.end_time = None

    def start(self):
        self.start_time = perf_counter()

    def stop(self):
        self.end_time = perf_counter()

    def elapsed_time(self):
        estimator_modifier = 1.1
        elapsed_seconds = (self.end_time - self.start_time) * estimator_modifier
        
        return elapsed_seconds   

# %% Driver code

'''
###############################################
DRIVER CODE
###############################################
'''

# %% Set working folder. Compatible with IDE or PyInstaller executable

if getattr(sys, 'frozen', False):
    # Running as a PyInstaller executable
    base_path = sys._MEIPASS
else:
    # Running normally as a Python script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

os.getcwd()


# %% Welcome screen

print()
print("*** Diverse-Assign v.0.2.3a ***")
print()
print(" --- Need help? \n --- Do you need a sample file to demo? \n --- You can refer to the README file for more info.")
print()
print("Hi there! Please put your CSV file of the participant profiles")
print("into the same folder as this programme.")
print()      
print("When ready, please input the file name below. \n --- File name must end with \'.csv\' \n --- File name e.g.: \'sample_class_group.csv\'")

# %% Load data 

while True:  
    try:
        input_filename = input("\n **Input file name here (e.g. my_participants.csv)**: ")
        
        if csvCheck(input_filename):
            data = read_csv(input_filename)
        else:    
            raise ValueError() 
        
    except Exception or OSError as e:
        print()
        print("\n Wrong input or file does not exist in this folder. Please re-try.")
        continue
    
    break

# Intermediary check for future debugging
# if debug_flag:
#     data.to_csv('IndexedInputV0_2_3a.csv', index = True)

# %% Define the number of groups

print()
print("Please input the number of groups you want to split your participant into.")
print(" --- The programme will evenly distribute the participants into diverse groups.")
while True:
    print()  
    try:
        num_groups = input("**Input the number of groups (numerical digit e.g. 12)**: ")
        num_groups = int(num_groups)
        num_rows = len(data)
        print()
        print(f"... there are {num_rows} participants in total.")
        
        if num_groups < 1:
            print("\n Wrong input. Number has to be an integer greater than 0.")
            raise ValueError
        
        elif num_groups >= num_rows:
            print("\n Wrong input. The number of groups must be smaller than the number of participants.")
            raise ValueError
        
    except Exception as e:
        print("\n Please re-try.")
        continue

    break

# %% Define the number instances or solutions to generate

exhaust_count = comb(num_rows, num_groups)
instance_count = comb(num_rows, 2)
if instance_count > exhaust_count:
    instance_count = exhaust_count
eliminated_count = exhaust_count - instance_count
if eliminated_count < instance_count:
    eliminated_count = 0

# %% Initialise assignment

print()
print("The programme is assigning the groups now.")

best_solution = None
initial_diversity = None
best_diversity = None
picked_solution = 0
minutes_esitmate = None
seconds_esitmate = None

# %% Heuristic estimation of problem size

print()
print(f"There are {exhaust_count:,} solutions possbile.")

print()
print(f"Eliminating {eliminated_count:,} solutions.")

print()
print(f"Simplifying to {instance_count:,} solutions.")
print("... working...")

sleep(15) # The time delay here is for UX purpose only. It is to give time to the user to read how long this programme will take.

# %% Drive assignment

# Assign groups over indicated number of instances.
# Then, pick the solution with greatest diversity
stopwatch = Stopwatch()
elapsed = 0

stopwatch.start()
for i in range(instance_count):
    solution_number = i + 1
    
    if best_solution is None:
        output = assigner(num_groups, num_rows, data)
        best_solution = output[0]
        initial_diversity = output[1]
        diversity = output[2]
        best_diversity = diversity 
    else:
        output = assigner(num_groups, num_rows, data)
        initial_diversity = output[1]
        diversity = output[2]
    
    print()
    print(f"Working on Solution Number {solution_number:,} of {instance_count:,} now...")

    
    print("Progress on current solution 100%")
    print()
    print(f"Solution Number {solution_number:,}'s initial diversity score was {initial_diversity}")
    print(f"Solution Number {solution_number:,}'s final diversity score was {best_diversity}")    
    
    if i == 0:
        stopwatch.stop()
        elapsed_clock = stopwatch.elapsed_time()
        elapsed = elapsed_clock  
    
    solutions_left = instance_count - solution_number
    elapsed = solutions_left * elapsed_clock

    minutes_estimate = elapsed // 60
    seconds_estimate = elapsed % 60
    
    print()
    print(f"Estimated time left to completion: {minutes_estimate:.0f} minutes {seconds_estimate:.0f} seconds") 
        
    if instance_count == 1:
        picked_solution = 1
    elif diversity > best_diversity:
        best_diversity = diversity
        best_solution = output[0]
        picked_solution = i + 1
    # debug_print(f"Solution number {solution_number}", best_diversity, True)
    # debug_print(f"Solution number {picked_solution}", diversity, True)

data = best_solution

# %% Solution found screen

print()
print(f"{instance_count} number of solutions completed. The best solution picked is Solution Number {picked_solution:,}. The best diversity score achieved was {best_diversity}")
# debug_print("best_solution picked", picked_solution, True)
# debug_print("achieved best_diversity", best_diversity, True)

print()
print("Group assignment is completed.")
    
# %% Save output to working folder

while True:
    print()
    print("Saving output... what is the file name to save to?")
    try: 
        output_filename = input("\n **Input the output save name here (e.g. done.csv)**: ")
        if csvCheck(output_filename):
            data.to_csv(f"{output_filename}")
        else:    
            raise ValueError() 
            
    except Exception as e:
        print("\n Wrong input. File name must be valid and end with \'.csv\' (e.g. done.csv)")
        print("Please re-try.")
        continue
    
    break

print()
print("The group assignment is stored into the current folder.") 
print(f"Output saved as: \n \'{output_filename}\'")

# %% Goodbye screen
print("\n You can close this programme now. \n Goodbye!")
input("\n Press [ENTER] to exit...")
