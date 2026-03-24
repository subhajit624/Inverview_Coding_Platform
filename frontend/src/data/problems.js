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
  },
    // ─── EASY ────────────────────────────────────────────────────────────────

  {
    id: 16,
    title: "Difference of Two Numbers",
    difficulty: "Easy",
    description: `Given two integers A and B, print A - B.\n\nExample:\n  Input:  10 3\n  Output: 7`,
    testCases: [
      { input: "10 3", expected: "7" },
      { input: "5 9", expected: "-4" },
      { input: "-2 -8", expected: "6" }
    ],
    starterCode: {
      python: `a, b = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst [a, b] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 17,
    title: "Count Digits",
    difficulty: "Easy",
    description: `Given an integer N, print the number of digits in it.\n\nExample:\n  Input:  12345\n  Output: 5`,
    testCases: [
      { input: "12345", expected: "5" },
      { input: "7", expected: "1" },
      { input: "1000", expected: "4" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = Math.abs(parseInt(new TextDecoder().decode(text.value).trim()));\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    long n = Math.abs(sc.nextLong());\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 18,
    title: "Sum of Digits",
    difficulty: "Easy",
    description: `Given an integer N, print the sum of its digits.\n\nExample:\n  Input:  123\n  Output: 6`,
    testCases: [
      { input: "123", expected: "6" },
      { input: "999", expected: "27" },
      { input: "5", expected: "5" }
    ],
    starterCode: {
      python: `n = abs(int(input()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = Math.abs(parseInt(new TextDecoder().decode(text.value).trim()));\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    long n = Math.abs(sc.nextLong());\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 19,
    title: "Armstrong Number",
    difficulty: "Easy",
    description: `Given a number N, print "Yes" if it is an Armstrong number, else print "No".\n\nExample:\n  Input:  153\n  Output: Yes`,
    testCases: [
      { input: "153", expected: "Yes" },
      { input: "123", expected: "No" },
      { input: "370", expected: "Yes" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = parseInt(new TextDecoder().decode(text.value).trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 20,
    title: "Remove Spaces",
    difficulty: "Easy",
    description: `Given a string, print it after removing all spaces.\n\nExample:\n  Input:  hello world\n  Output: helloworld`,
    testCases: [
      { input: "hello world", expected: "helloworld" },
      { input: "a b c", expected: "abc" },
      { input: "no_spaces", expected: "no_spaces" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trimEnd();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 21,
    title: "Frequency of Character",
    difficulty: "Easy",
    description: `Given a string and a character, print how many times the character appears.\n\nExample:\n  Input:  hello\n          l\n  Output: 2`,
    testCases: [
      { input: "hello\nl", expected: "2" },
      { input: "banana\na", expected: "3" },
      { input: "abc\nz", expected: "0" }
    ],
    starterCode: {
      python: `s = input()\nch = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst s = lines[0];\nconst ch = lines[1].trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    String ch = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 22,
    title: "First and Last Character",
    difficulty: "Easy",
    description: `Given a string, print its first and last characters on separate lines.\n\nExample:\n  Input:  hello\n  Output:\n  h\n  o`,
    testCases: [
      { input: "hello", expected: "h\no" },
      { input: "a", expected: "a\na" },
      { input: "world", expected: "w\nd" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 23,
    title: "Square of a Number",
    difficulty: "Easy",
    description: `Given an integer N, print its square.\n\nExample:\n  Input:  6\n  Output: 36`,
    testCases: [
      { input: "6", expected: "36" },
      { input: "-4", expected: "16" },
      { input: "10", expected: "100" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = parseInt(new TextDecoder().decode(text.value).trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 24,
    title: "Convert to Uppercase",
    difficulty: "Easy",
    description: `Given a string, print it in uppercase.\n\nExample:\n  Input:  hello\n  Output: HELLO`,
    testCases: [
      { input: "hello", expected: "HELLO" },
      { input: "Code", expected: "CODE" },
      { input: "aBc", expected: "ABC" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 25,
    title: "Find String Length",
    difficulty: "Easy",
    description: `Given a string, print its length.\n\nExample:\n  Input:  hello\n  Output: 5`,
    testCases: [
      { input: "hello", expected: "5" },
      { input: "a", expected: "1" },
      { input: "problem", expected: "7" }
    ],
    starterCode: {
      python: `s = input()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 26,
    title: "Leap Year Check",
    difficulty: "Easy",
    description: `Given a year, print "Yes" if it is a leap year, else print "No".\n\nExample:\n  Input:  2024\n  Output: Yes`,
    testCases: [
      { input: "2024", expected: "Yes" },
      { input: "1900", expected: "No" },
      { input: "2000", expected: "Yes" }
    ],
    starterCode: {
      python: `year = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst year = parseInt(new TextDecoder().decode(text.value).trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int year = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 27,
    title: "Print Numbers from 1 to N",
    difficulty: "Easy",
    description: `Given N, print numbers from 1 to N each on a new line.\n\nExample:\n  Input:  3\n  Output:\n  1\n  2\n  3`,
    testCases: [
      { input: "3", expected: "1\n2\n3" },
      { input: "1", expected: "1" },
      { input: "5", expected: "1\n2\n3\n4\n5" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = parseInt(new TextDecoder().decode(text.value).trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 28,
    title: "Swap Two Numbers",
    difficulty: "Easy",
    description: `Given two integers A and B, print them after swapping.\n\nExample:\n  Input:  4 9\n  Output:\n  9 4`,
    testCases: [
      { input: "4 9", expected: "9 4" },
      { input: "1 2", expected: "2 1" },
      { input: "-3 5", expected: "5 -3" }
    ],
    starterCode: {
      python: `a, b = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst [a, b] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 29,
    title: "Second Largest of Three",
    difficulty: "Easy",
    description: `Given three integers, print the second largest one.\n\nExample:\n  Input:  10 5 7\n  Output: 7`,
    testCases: [
      { input: "10 5 7", expected: "7" },
      { input: "1 2 3", expected: "2" },
      { input: "9 9 1", expected: "9" }
    ],
    starterCode: {
      python: `a, b, c = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst [a, b, c] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 30,
    title: "Count Words",
    difficulty: "Easy",
    description: `Given a sentence, print the number of words in it.\n\nExample:\n  Input:  hello world from code\n  Output: 4`,
    testCases: [
      { input: "hello world", expected: "2" },
      { input: "one two three four", expected: "4" },
      { input: "single", expected: "1" }
    ],
    starterCode: {
      python: `s = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  // ─── MEDIUM ───────────────────────────────────────────────────────────────

  {
    id: 31,
    title: "Prefix Sum of Array",
    difficulty: "Medium",
    description: `Given an array, print its prefix sum array.\n\nExample:\n  Input:\n  3\n  1 2 3\n  Output:\n  1 3 6`,
    testCases: [
      { input: "3\n1 2 3", expected: "1 3 6" },
      { input: "5\n2 4 6 8 10", expected: "2 6 12 20 30" },
      { input: "1\n7", expected: "7" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 32,
    title: "Rotate Array Left",
    difficulty: "Medium",
    description: `Given an array and an integer K, rotate the array left by K positions.\n\nExample:\n  Input:\n  5 2\n  1 2 3 4 5\n  Output:\n  3 4 5 1 2`,
    testCases: [
      { input: "5 2\n1 2 3 4 5", expected: "3 4 5 1 2" },
      { input: "4 1\n9 8 7 6", expected: "8 7 6 9" },
      { input: "3 3\n1 2 3", expected: "1 2 3" }
    ],
    starterCode: {
      python: `n, k = map(int, input().split())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, k] = lines[0].split(' ').map(Number);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), k = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 33,
    title: "Missing Number",
    difficulty: "Medium",
    description: `Given N and an array of size N-1 containing numbers from 1 to N, print the missing number.\n\nExample:\n  Input:\n  5\n  1 2 4 5\n  Output:\n  3`,
    testCases: [
      { input: "5\n1 2 4 5", expected: "3" },
      { input: "4\n1 3 4", expected: "2" },
      { input: "3\n2 3", expected: "1" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n - 1];\n    for (int i = 0; i < n - 1; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 34,
    title: "Frequency of Numbers",
    difficulty: "Medium",
    description: `Given an array and a target number, print how many times the target appears.\n\nExample:\n  Input:\n  5\n  1 2 2 3 2\n  2\n  Output:\n  3`,
    testCases: [
      { input: "5\n1 2 2 3 2\n2", expected: "3" },
      { input: "4\n4 4 4 4\n4", expected: "4" },
      { input: "3\n1 2 3\n5", expected: "0" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\ntarget = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\nconst target = parseInt(lines[2].trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n    int target = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 35,
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    description: `Given an array, print the maximum subarray sum.\n\nExample:\n  Input:\n  5\n  -2 1 -3 4 -1\n  Output:\n  4`,
    testCases: [
      { input: "5\n-2 1 -3 4 -1", expected: "4" },
      { input: "3\n1 2 3", expected: "6" },
      { input: "4\n-5 -2 -8 -1", expected: "-1" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 36,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Medium",
    description: `Given a sorted array, print the array after removing duplicates.\n\nExample:\n  Input:\n  6\n  1 1 2 2 3 3\n  Output:\n  1 2 3`,
    testCases: [
      { input: "6\n1 1 2 2 3 3", expected: "1 2 3" },
      { input: "5\n1 2 3 4 5", expected: "1 2 3 4 5" },
      { input: "4\n7 7 7 7", expected: "7" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 37,
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: `Given a string containing only (), {}, and [], print "Yes" if it is valid, else print "No".\n\nExample:\n  Input:  ()[]{}\n  Output: Yes`,
    testCases: [
      { input: "()[]{}", expected: "Yes" },
      { input: "(]", expected: "No" },
      { input: "([{}])", expected: "Yes" }
    ],
    starterCode: {
      python: `s = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 38,
    title: "Anagram Check",
    difficulty: "Medium",
    description: `Given two strings, print "Yes" if they are anagrams, else print "No".\n\nExample:\n  Input:\n  listen\n  silent\n  Output:\n  Yes`,
    testCases: [
      { input: "listen\nsilent", expected: "Yes" },
      { input: "hello\nworld", expected: "No" },
      { input: "race\ncare", expected: "Yes" }
    ],
    starterCode: {
      python: `a = input().strip()\nb = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst a = lines[0].trim();\nconst b = lines[1].trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String a = sc.nextLine().trim();\n    String b = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 39,
    title: "Longest Word",
    difficulty: "Medium",
    description: `Given a sentence, print the longest word. If there are multiple, print the first one.\n\nExample:\n  Input:  I love competitive programming\n  Output: competitive`,
    testCases: [
      { input: "I love competitive programming", expected: "competitive" },
      { input: "one two three", expected: "three" },
      { input: "a bb ccc", expected: "ccc" }
    ],
    starterCode: {
      python: `s = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst s = new TextDecoder().decode(text.value).trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 40,
    title: "Matrix Sum",
    difficulty: "Medium",
    description: `Given an N x M matrix, print the sum of all elements.\n\nExample:\n  Input:\n  2 2\n  1 2\n  3 4\n  Output:\n  10`,
    testCases: [
      { input: "2 2\n1 2\n3 4", expected: "10" },
      { input: "1 3\n5 6 7", expected: "18" },
      { input: "2 1\n-1\n-2", expected: "-3" }
    ],
    starterCode: {
      python: `n, m = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, m] = lines[0].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), m = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 41,
    title: "Nth Fibonacci Number",
    difficulty: "Medium",
    description: `Given N, print the Nth Fibonacci number where F(0)=0 and F(1)=1.\n\nExample:\n  Input:  7\n  Output: 13`,
    testCases: [
      { input: "7", expected: "13" },
      { input: "0", expected: "0" },
      { input: "1", expected: "1" }
    ],
    starterCode: {
      python: `n = int(input())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst n = parseInt(new TextDecoder().decode(text.value).trim());\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 42,
    title: "Count Even Numbers",
    difficulty: "Medium",
    description: `Given an array, print how many even numbers are present.\n\nExample:\n  Input:\n  5\n  1 2 3 4 5\n  Output:\n  2`,
    testCases: [
      { input: "5\n1 2 3 4 5", expected: "2" },
      { input: "4\n2 4 6 8", expected: "4" },
      { input: "3\n1 3 5", expected: "0" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 43,
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: `Given an array and K, print the number of subarrays whose sum equals K.\n\nExample:\n  Input:\n  5 5\n  1 2 3 2 1\n  Output:\n  2`,
    testCases: [
      { input: "5 5\n1 2 3 2 1", expected: "2" },
      { input: "4 3\n1 1 1 1", expected: "2" },
      { input: "3 0\n0 0 0", expected: "6" }
    ],
    starterCode: {
      python: `n, k = map(int, input().split())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, k] = lines[0].split(' ').map(Number);\nconst a = lines[1].trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), k = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  // ─── HARD ─────────────────────────────────────────────────────────────────

  {
    id: 44,
    title: "Merge Intervals",
    difficulty: "Hard",
    description: `Given N intervals, merge all overlapping intervals and print the result.\n\nExample:\n  Input:\n  4\n  1 3\n  2 6\n  8 10\n  15 18\n  Output:\n  1 6\n  8 10\n  15 18`,
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", expected: "1 6\n8 10\n15 18" },
      { input: "3\n1 4\n4 5\n6 7", expected: "1 5\n6 7" },
      { input: "2\n1 2\n3 4", expected: "1 2\n3 4" }
    ],
    starterCode: {
      python: `n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst intervals = [];\nfor (let i = 1; i <= n; i++) intervals.push(lines[i].split(' ').map(Number));\n\n// Write your solution here\n`,
      java: `import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[][] intervals = new int[n][2];\n    for (int i = 0; i < n; i++) {\n      intervals[i][0] = sc.nextInt();\n      intervals[i][1] = sc.nextInt();\n    }\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 45,
    title: "Longest Common Subsequence Length",
    difficulty: "Hard",
    description: `Given two strings, print the length of their longest common subsequence.\n\nExample:\n  Input:\n  abcde\n  ace\n  Output:\n  3`,
    testCases: [
      { input: "abcde\nace", expected: "3" },
      { input: "abc\nabc", expected: "3" },
      { input: "abc\ndef", expected: "0" }
    ],
    starterCode: {
      python: `a = input().strip()\nb = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst a = lines[0].trim();\nconst b = lines[1].trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String a = sc.nextLine().trim();\n    String b = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 46,
    title: "Minimum Coins",
    difficulty: "Hard",
    description: `Given coin denominations and a target amount, print the minimum number of coins needed to make the amount. Print -1 if not possible.\n\nExample:\n  Input:\n  3 11\n  1 2 5\n  Output:\n  3`,
    testCases: [
      { input: "3 11\n1 2 5", expected: "3" },
      { input: "2 3\n2 4", expected: "-1" },
      { input: "4 6\n1 3 4 5", expected: "2" }
    ],
    starterCode: {
      python: `n, amount = map(int, input().split())\ncoins = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, amount] = lines[0].split(' ').map(Number);\nconst coins = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), amount = sc.nextInt();\n    int[] coins = new int[n];\n    for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 47,
    title: "Top K Frequent Elements",
    difficulty: "Hard",
    description: `Given an array and K, print the K most frequent elements in any order.\n\nExample:\n  Input:\n  6 2\n  1 1 1 2 2 3\n  Output:\n  1 2`,
    testCases: [
      { input: "6 2\n1 1 1 2 2 3", expected: "1 2" },
      { input: "5 1\n4 4 5 5 5", expected: "5" },
      { input: "4 2\n7 8 7 9", expected: "7 8" }
    ],
    starterCode: {
      python: `n, k = map(int, input().split())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, k] = lines[0].split(' ').map(Number);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), k = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 48,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: `Given an array of heights, print the total trapped rain water.\n\nExample:\n  Input:\n  6\n  3 0 2 0 4 0\n  Output:\n  7`,
    testCases: [
      { input: "6\n3 0 2 0 4 0", expected: "7" },
      { input: "4\n0 1 0 2", expected: "1" },
      { input: "5\n4 2 0 3 2", expected: "4" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 49,
    title: "Next Greater Element",
    difficulty: "Hard",
    description: `Given an array, print the next greater element for each element. If none exists, print -1.\n\nExample:\n  Input:\n  4\n  4 5 2 25\n  Output:\n  5 25 25 -1`,
    testCases: [
      { input: "4\n4 5 2 25", expected: "5 25 25 -1" },
      { input: "3\n13 7 6", expected: "-1 -1 -1" },
      { input: "5\n1 3 2 4 5", expected: "3 4 4 5 -1" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 50,
    title: "Rotting Oranges",
    difficulty: "Hard",
    description: `Given a grid of oranges, print the minimum time needed for all fresh oranges to rot. If impossible, print -1.\n\nExample:\n  Input:\n  3 3\n  2 1 1\n  1 1 0\n  0 1 1\n  Output:\n  4`,
    testCases: [
      { input: "3 3\n2 1 1\n1 1 0\n0 1 1", expected: "4" },
      { input: "1 2\n2 1", expected: "1" },
      { input: "2 2\n0 2\n1 1", expected: "-1" }
    ],
    starterCode: {
      python: `n, m = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(n)]\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, m] = lines[0].split(' ').map(Number);\nconst grid = [];\nfor (let i = 1; i <= n; i++) grid.push(lines[i].split(' ').map(Number));\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), m = sc.nextInt();\n    int[][] grid = new int[n][m];\n    for (int i = 0; i < n; i++) {\n      for (int j = 0; j < m; j++) grid[i][j] = sc.nextInt();\n    }\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 51,
    title: "Kth Largest Element",
    difficulty: "Hard",
    description: `Given an array and K, print the Kth largest element.\n\nExample:\n  Input:\n  5 2\n  3 1 5 4 2\n  Output:\n  4`,
    testCases: [
      { input: "5 2\n3 1 5 4 2", expected: "4" },
      { input: "4 1\n10 20 30 40", expected: "40" },
      { input: "6 3\n7 7 8 9 1 2", expected: "7" }
    ],
    starterCode: {
      python: `n, k = map(int, input().split())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, k] = lines[0].split(' ').map(Number);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), k = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 52,
    title: "Shortest Path in Unweighted Graph",
    difficulty: "Hard",
    description: `Given N, M and M edges of an unweighted graph, print the shortest distance from node 1 to node N. If unreachable, print -1.\n\nExample:\n  Input:\n  4 4\n  1 2\n  2 3\n  3 4\n  1 4\n  Output:\n  1`,
    testCases: [
      { input: "4 4\n1 2\n2 3\n3 4\n1 4", expected: "1" },
      { input: "4 3\n1 2\n2 3\n3 4", expected: "3" },
      { input: "3 1\n1 2", expected: "-1" }
    ],
    starterCode: {
      python: `n, m = map(int, input().split())\nfor _ in range(m):\n    u, v = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst [n, m] = lines[0].split(' ').map(Number);\nfor (let i = 1; i <= m; i++) {\n  const [u, v] = lines[i].split(' ').map(Number);\n}\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), m = sc.nextInt();\n    for (int i = 0; i < m; i++) {\n      int u = sc.nextInt(), v = sc.nextInt();\n    }\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 53,
    title: "Minimum Window Length",
    difficulty: "Hard",
    description: `Given a string and a target character, print the length of the smallest substring containing that character at least once. If not found, print -1.\n\nExample:\n  Input:\n  abcbcba\n  c\n  Output:\n  2`,
    testCases: [
      { input: "abcbcba\nc", expected: "2" },
      { input: "aaaaa\na", expected: "1" },
      { input: "hello\nz", expected: "-1" }
    ],
    starterCode: {
      python: `s = input().strip()\nt = input().strip()\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst s = lines[0].trim();\nconst t = lines[1].trim();\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine().trim();\n    String t = sc.nextLine().trim();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 54,
    title: "Maximum Product Subarray",
    difficulty: "Hard",
    description: `Given an array, print the maximum product of a contiguous subarray.\n\nExample:\n  Input:\n  5\n  2 3 -2 4 -1\n  Output:\n  48`,
    testCases: [
      { input: "5\n2 3 -2 4 -1", expected: "48" },
      { input: "3\n-2 0 -1", expected: "0" },
      { input: "4\n-1 -3 -10 0", expected: "30" }
    ],
    starterCode: {
      python: `n = int(input())\na = list(map(int, input().split()))\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst lines = new TextDecoder().decode(text.value).trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst a = lines[1].split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] a = new int[n];\n    for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  },

  {
    id: 55,
    title: "Count Paths in Grid",
    difficulty: "Hard",
    description: `Given an N x M grid, print the number of ways to go from top-left to bottom-right using only right and down moves.\n\nExample:\n  Input:\n  2 2\n  Output:\n  2`,
    testCases: [
      { input: "2 2", expected: "2" },
      { input: "3 3", expected: "6" },
      { input: "1 5", expected: "1" }
    ],
    starterCode: {
      python: `n, m = map(int, input().split())\n\n# Write your solution here\n`,
      javascript: `const text = await Deno.stdin.readable.getReader().read();\nconst [n, m] = new TextDecoder().decode(text.value).trim().split(' ').map(Number);\n\n// Write your solution here\n`,
      java: `import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt(), m = sc.nextInt();\n\n    // Write your solution here\n  }\n}`
    }
  }
];

export default problems;