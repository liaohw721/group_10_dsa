# group_10_dsa
String matching visualizer  visualizer

link:
https://liaohw721.github.io/group_10_dsa/frontend/startingpage.html

team memebers, 
henry
黃庭躍
張宇朋
鍾尚旂
陳悟源
黃逸

# String Matching Visualizer (KMP Algorithm)
**Group 10 - Data Structures & Algorithms Project**

## 📖 Introduction
Welcome to our Interactive String Matching Visualizer! This project is a web-based educational tool designed to help students and developers understand the **Knuth-Morris-Pratt (KMP)** algorithm. Instead of just looking at raw code, this visualizer brings the algorithm to life using step-by-step color-coded animations, making complex data structures intuitive and easy to grasp.

---

## 🚀 How to Use the Program

You can access the live visualizer here: **`(https://liaohw721.github.io/group_10_dsa/frontend/startingpage.html)`** .

### Step-by-Step Guide:
1. **Starting Page:** Click the **"Start"** button on the home screen to enter the visualizer.
2. **Insert Page:** * You will see two input fields: **Text** (the main string you want to search inside) and **Pattern** (the specific substring you are looking for).
   * Type your Text and press **Enter**, then type your Pattern and press **Enter** (or click "Start Matching").
3. **Preprocessing Page (&pi; Array):**
   * This page demonstrates the first phase of KMP. You will watch an automatic animation calculate the &pi; (Pi) array—also known as the LPS (Longest Prefix Suffix) array.
   * **Color Guide:**
     * 🟨 **Yellow:** Currently comparing two characters.
     * 🟩 **Green:** A match is found; the &pi; value increases.
     * 🟥 **Red:** A mismatch is found; the algorithm falls back.
     * 🟦 **Blue:** The calculated &pi; value is locked in.
   * Once the animation finishes, click **"Next: Matching"**.
4. **Main Process Page:**
   * This is the main search phase. Click **"Start Matching"** to begin.
   * The program will scan the Text for the Pattern. Upon a mismatch, instead of restarting from the beginning, you will see the Pattern shift intelligently based on the &pi; array.
   * When the algorithm finishes, a success message will display the **exact indices** where your pattern was found!

---

## 🧠 How the DSA Works: The KMP Logic

### The Problem
In a "Naive" or "Brute Force" string matching algorithm, if we are searching for a pattern in a text and find a mismatch, we shift the pattern over by just 1 space and start comparing all over again. This is slow and results in a time complexity of **O(n * m)**, where *n* is the length of the text and *m* is the length of the pattern.

### The KMP Solution
The **Knuth-Morris-Pratt (KMP)** algorithm optimizes this to a time complexity of **O(n + m)**. 
The core logic of KMP is: **"When a mismatch occurs, never re-evaluate characters that we already know match."**

It achieves this in two distinct parts:

#### Part 1: Preprocessing (The &pi; Array / LPS Array)
Before searching the text, KMP analyzes the *Pattern* itself. It creates an array called the &pi; array (or LPS array, standing for **L**ongest proper **P**refix which is also a **S**uffix).
* This array tells the algorithm: *If a mismatch happens at index `j`, what is the longest prefix of the pattern that matches the suffix of the pattern we've seen so far?*
* This prevents the algorithm from moving the text pointer backwards.

#### Part 2: The Main Search
We use two pointers: `i` for the Text, and `j` for the Pattern.
* If `Text[i] == Pattern[j]`, both pointers move forward (`i++`, `j++`).
* If `Text[i] != Pattern[j]` (a mismatch occurs):
  * **Naive approach:** Reset `i` and `j`.
  * **KMP approach:** We keep the text pointer `i` exactly where it is. We update the pattern pointer `j` by looking at the &pi; array: `j = pi[j - 1]`. The pattern slides to the right, skipping unnecessary comparisons.

---

## 📝 Example Walkthrough

Let's trace a simple example to see the logic in action.

* **Text:** `aabaabaaa`
* **Pattern:** `aaba`

### 1. Preprocessing (Building the &pi; Array)
We look for the longest prefix that is also a suffix for every sub-pattern in `aaba`:
* `a` -> No proper prefix/suffix. &pi;[0] = **0**
* `aa` -> Prefix 'a' matches Suffix 'a'. &pi;[1] = **1**
* `aab` -> Prefix 'aa' does not match suffix 'ab'. &pi;[2] = **0**
* `aaba` -> Prefix 'a' matches suffix 'a'. &pi;[3] = **1**

**Resulting &pi; Array:** `[0, 1, 0, 1]`

### 2. Main Search
* **Step 1:** Compare Text and Pattern from the start.
  ```text
  Text:    a a b a a b a a a
  Pattern: a a b a
  
 * **Step 2:**Because we found a match, we use our $\pi$ array to jump j. j = pi[3], so j becomes 1. This means we shift the pattern, but we already know the first a matches!
  ```text
 Text:    a a b a a b a a a
               ^ (i is here at index 4)
Pattern:       a a b a
               ^ (j is here at index 1).
 * **Step 3: ** We continue matching from i=4 and j=1. a, b, and a match! We found our second match. Result saved at index 3..
 * **Conclusion: : **The algorithm successfully skips redundant checks, finding the pattern at indices 0 and 3 efficiently...
