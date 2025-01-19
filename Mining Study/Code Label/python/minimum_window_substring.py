from collections import Counter, deque

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if len(s) < len(t): return ''

        substring_counter = Counter(t)
        temp_counter = substring_counter.copy()
        counter = Counter()
        n = len(s)
        l = 0
        r = 0
        min_length = float('inf')
        min_string = ''

        # slide start to first encounter of 't' char
        while l < n and not s[l] in substring_counter:
            l += 1
        r = l
        if r == n:
            return ''

        # build window until all chars are in
        while temp_counter and r < n:
            char = s[r]
            counter[char] += 1
            if char in temp_counter:
                temp_counter[char] -= 1
                if temp_counter[char] == 0:
                    del temp_counter[char]
            r += 1
        r -= 1
        if r == n - 1 and temp_counter:
            return ''
        min_length = min(r - l + 1, min_length)
        min_string = s[l:r + 1]

        keep_search = True
        while keep_search:
            last_char = s[l]
            if r < n and counter[last_char] <= substring_counter[last_char]: # cant afford to drop last char
                r += 1
                while r < n:
                    counter[s[r]] += 1
                    if s[r] == last_char:
                        break
                    r += 1
                if r == n: # could not find replacement so min window is set
                    keep_search = False 
                    break
            # slide back of window up until another 't' char is met
            counter[last_char] -= 1
            l += 1
            while not s[l] in substring_counter:
                counter[l] -= 1
                l += 1
            if r - l + 1< min_length:
                min_length = r - l + 1
                min_string = s[l:r + 1]
            
        return min_string
    
    # written by copilot based on my code
    def minWindow(s: str, t: str) -> str:
        if len(s) < len(t): return ''

        substring_counter = Counter(t)
        counter = Counter()
        l = r = 0
        min_length = float('inf')
        min_string = ''

        for r, c in enumerate(s):
            if c in substring_counter:
                counter[c] += 1
            while counter & substring_counter == substring_counter:
                if r - l + 1 < min_length:
                    min_length = r - l + 1
                    min_string = s[l:r+1]
                d = s[l]
                if d in substring_counter:
                    counter[d] -= 1
                l += 1

        return min_string if min_length <= len(s) else ''


s = Solution()

print(s.minWindow("a", "a"))