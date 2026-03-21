const problems = [
  // ─── EASY ────────────────────────────────────────────────────────────────

  {
    id: 1,
    title: "Add Two Numbers",
    difficulty: "Easy",
    description: `Given two integers A and B on the same line, print their sum.\n\nExample:\n  Input:  3 5\n  Output: 8`,
    testCases: [
      { input: "3 5",   expected: "8"  },
      { input: "10 20", expected: "30" },
      { input: "-1 1",  expected: "0"  }
    ],
    starterCode: {
      python: `# Read input\na, b = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const [a, b] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt(), b = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    description: `Given a string, print it reversed.\n\nExample:\n  Input:  hello\n  Output: olleh`,
    testCases: [
      { input: "hello",   expected: "olleh"   },
      { input: "abcdef",  expected: "fedcba"  },
      { input: "racecar", expected: "racecar" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const s = new TextDecoder().decode(text.value).trim();

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.next();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 3,
    title: "Even or Odd",
    difficulty: "Easy",
    description: `Given an integer N, print "Even" if it is even, else print "Odd".\n\nExample:\n  Input:  4\n  Output: Even`,
    testCases: [
      { input: "4", expected: "Even" },
      { input: "7", expected: "Odd"  },
      { input: "0", expected: "Even" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const n = parseInt(new TextDecoder().decode(text.value).trim());

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 4,
    title: "Factorial",
    difficulty: "Easy",
    description: `Given a non-negative integer N, print its factorial.\n\nExample:\n  Input:  5\n  Output: 120`,
    testCases: [
      { input: "5",  expected: "120"     },
      { input: "0",  expected: "1"       },
      { input: "10", expected: "3628800" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const n = parseInt(new TextDecoder().decode(text.value).trim());

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 5,
    title: "Max of Two Numbers",
    difficulty: "Easy",
    description: `Given two integers A and B, print the larger one.\n\nExample:\n  Input:  5 3\n  Output: 5`,
    testCases: [
      { input: "5 3",   expected: "5"  },
      { input: "10 20", expected: "20" },
      { input: "-5 -3", expected: "-3" }
    ],
    starterCode: {
      python: `a, b = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const [a, b] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt(), b = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 6,
    title: "Count Vowels",
    difficulty: "Easy",
    description: `Given a string, print the number of vowels (a, e, i, o, u) in it.\n\nExample:\n  Input:  hello\n  Output: 2`,
    testCases: [
      { input: "hello",  expected: "2" },
      { input: "aeiou",  expected: "5" },
      { input: "rhythm", expected: "0" }
    ],
    starterCode: {
      python: `s = input().lower()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const s = new TextDecoder().decode(text.value).trim().toLowerCase();

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.next().toLowerCase();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 7,
    title: "Palindrome Check",
    difficulty: "Easy",
    description: `Given a string, print "Yes" if it is a palindrome, else print "No".\n\nExample:\n  Input:  racecar\n  Output: Yes`,
    testCases: [
      { input: "racecar", expected: "Yes" },
      { input: "hello",   expected: "No"  },
      { input: "level",   expected: "Yes" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const s = new TextDecoder().decode(text.value).trim();

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.next();

    // Write your solution here
  }
}`
    }
  },

  // ─── MEDIUM ───────────────────────────────────────────────────────────────

  {
    id: 8,
    title: "Sum of Array",
    difficulty: "Medium",
    description: `First line contains N. Second line contains N space-separated integers. Print their sum.\n\nExample:\n  Input:  3\n          1 2 3\n  Output: 6`,
    testCases: [
      { input: "3\n1 2 3",          expected: "6"   },
      { input: "5\n10 20 30 40 50", expected: "150" },
      { input: "1\n-5",             expected: "-5"  }
    ],
    starterCode: {
      python: `n = int(input())
nums = list(map(int, input().split()))

# Write your solution here
`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const lines = new TextDecoder().decode(text.value).trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].trim().split(' ').map(Number);

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 9,
    title: "Prime Check",
    difficulty: "Medium",
    description: `Given an integer N, print "Yes" if it is prime, else print "No".\n\nExample:\n  Input:  7\n  Output: Yes`,
    testCases: [
      { input: "7",  expected: "Yes" },
      { input: "1",  expected: "No"  },
      { input: "13", expected: "Yes" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const n = parseInt(new TextDecoder().decode(text.value).trim());

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 10,
    title: "Linear Search",
    difficulty: "Medium",
    description: `First line contains space-separated integers. Second line contains a target. Print the 0-based index of the target, or -1 if not found.\n\nExample:\n  Input:  5 3 8 1 9\n          8\n  Output: 2`,
    testCases: [
      { input: "5 3 8 1 9\n8", expected: "2"  },
      { input: "1 2 3 4 5\n6", expected: "-1" },
      { input: "10 20 30\n10", expected: "0"  }
    ],
    starterCode: {
      python: `nums = list(map(int, input().split()))
target = int(input())

# Write your solution here
`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const lines = new TextDecoder().decode(text.value).trim().split('\\n');
const nums = lines[0].trim().split(' ').map(Number);
const target = parseInt(lines[1].trim());

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String[] parts = sc.nextLine().split(" ");
    int target = Integer.parseInt(sc.nextLine().trim());

    // Write your solution here
  }
}`
    }
  },

  {
    id: 11,
    title: "FizzBuzz",
    difficulty: "Medium",
    description: `Given N, print numbers 1 to N. But for multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".\n\nExample:\n  Input:  5\n  Output: 1\n          2\n          Fizz\n          4\n          Buzz`,
    testCases: [
      { input: "5", expected: "1\n2\nFizz\n4\nBuzz" },
      { input: "3", expected: "1\n2\nFizz"           },
      { input: "1", expected: "1"                    }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const n = parseInt(new TextDecoder().decode(text.value).trim());

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 12,
    title: "GCD of Two Numbers",
    difficulty: "Medium",
    description: `Given two integers A and B, print their Greatest Common Divisor (GCD).\n\nExample:\n  Input:  12 8\n  Output: 4`,
    testCases: [
      { input: "12 8",   expected: "4"  },
      { input: "100 75", expected: "25" },
      { input: "7 5",    expected: "1"  }
    ],
    starterCode: {
      python: `a, b = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
let [a, b] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt(), b = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  // ─── HARD ─────────────────────────────────────────────────────────────────

  {
    id: 13,
    title: "Largest in Array",
    difficulty: "Hard",
    description: `First line contains N. Second line contains N space-separated integers. Print the largest element.\n\nExample:\n  Input:  5\n          3 1 4 1 5\n  Output: 5`,
    testCases: [
      { input: "5\n3 1 4 1 5",   expected: "5"  },
      { input: "3\n-1 -5 -2",    expected: "-1" },
      { input: "4\n10 20 30 40", expected: "40" }
    ],
    starterCode: {
      python: `n = int(input())
nums = list(map(int, input().split()))

# Write your solution here
`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const lines = new TextDecoder().decode(text.value).trim().split('\\n');
const nums = lines[1].trim().split(' ').map(Number);

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

    // Write your solution here
  }
}`
    }
  },

  {
    id: 14,
    title: "Binary Search",
    difficulty: "Hard",
    description: `First line contains N sorted space-separated integers. Second line contains target. Print the 0-based index using binary search, or -1 if not found.\n\nExample:\n  Input:  1 3 5 7 9\n          7\n  Output: 3`,
    testCases: [
      { input: "1 3 5 7 9\n7",  expected: "3"  },
      { input: "2 4 6 8 10\n5", expected: "-1" },
      { input: "1 2 3 4 5\n1",  expected: "0"  }
    ],
    starterCode: {
      python: `nums = list(map(int, input().split()))
target = int(input())

# Write your solution here (use binary search, not linear search)
`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const lines = new TextDecoder().decode(text.value).trim().split('\\n');
const nums = lines[0].trim().split(' ').map(Number);
const target = parseInt(lines[1].trim());

// Write your solution here (use binary search, not linear search)
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String[] parts = sc.nextLine().split(" ");
    int target = Integer.parseInt(sc.nextLine().trim());

    // Write your solution here (use binary search, not linear search)
  }
}`
    }
  },

  {
    id: 15,
    title: "Count Word Occurrences",
    difficulty: "Hard",
    description: `First line contains a sentence. Second line contains a word. Print how many times the word appears (case-insensitive).\n\nExample:\n  Input:  the cat sat on the mat\n          the\n  Output: 2`,
    testCases: [
      { input: "the cat sat on the mat\nthe",   expected: "2" },
      { input: "hello world hello hello\nhello", expected: "3" },
      { input: "one two three\nfour",            expected: "0" }
    ],
    starterCode: {
      python: `sentence = input().lower().split()
word = input().lower()

# Write your solution here
`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();
const lines = new TextDecoder().decode(text.value).trim().split('\\n');
const words = lines[0].toLowerCase().split(' ');
const word  = lines[1].trim().toLowerCase();

// Write your solution here
`,
      java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String[] words = sc.nextLine().toLowerCase().split(" ");
    String word = sc.nextLine().trim().toLowerCase();

    // Write your solution here
  }
}`
    }
  }
];

export default problems;