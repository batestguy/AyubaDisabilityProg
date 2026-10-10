import { additionalSkillCourses } from './skillCourses';
import type { SkillCategory } from './skillCategories';
export type Lesson = {
  title: string;
  body: string;
  resource?: string;
  video?: string;
  transcript?: string;
};
export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};
export type Course = {
  category?: SkillCategory;
  delivery?: 'foundation' | 'self-paced';
  tools?: string[];
  outcome?: string;
  id: string;
  title: string;
  description: string;
  tag: string;
  skills: string[];
  lessons: Lesson[];
  quiz: QuizQuestion[];
  assignment: string;
  status: "draft" | "review" | "published";
  consultantId: string;
};
export const courses: Course[] = [
  {
    id: "digital-essentials",
    category: 'digital',
    delivery: 'self-paced',
    title: "Digital Essentials",
    description:
      "Use your device, organise files and communicate safely online.",
    tag: "Start here",
    skills: [
      "Digital confidence",
      "File management",
      "Online safety",
      "Communication",
    ],
    status: "published",
    consultantId: "expert-demo",
    lessons: [
      {
        title: "Make your device work for you",
        body: "Adjust text size, brightness and volume until they are comfortable. Try screen reading, voice typing or keyboard controls if useful. Practice opening an app, switching to another app and returning. Take breaks when needed.",
        resource:
          "Practice: name one setting that makes your device easier to use and describe how to find it.",
      },
      {
        title: "Create and find your files",
        body: "A file holds information, such as a document or photo. A folder groups related files. Use clear names such as Market-budget-October. Save a short note, close it and find it again. Keep a backup of important work in a separate safe place.",
        resource:
          "Practice: create a Learning folder and save a note named My-first-note inside it.",
      },
      {
        title: "Search with a clear question",
        body: "Use specific search words. Compare results and check the author, update date and supporting evidence. An advertisement or first result is not automatically trustworthy. Avoid downloading files you do not recognise.",
        resource:
          "Practice: search for a skill you want to learn. Record who wrote one result and why you trust it.",
      },
      {
        title: "Write a useful message",
        body: "Use a short subject, a greeting, the main request and a closing. Check the recipient and attachments before sending. Share only personal details needed for the task. Ask permission before forwarding a private message.",
        resource:
          "Practice: draft a message asking a mentor for help. Include what you tried and one clear question.",
      },
      {
        title: "Protect your accounts",
        body: "Use a long, unique password for each account. A trusted password manager can help. Turn on a second sign-in step when available. Never share passwords or one-time codes. Verify urgent requests for money or account details through a contact method you already trust.",
        resource:
          "Practice: write an account-safety checklist. Do not include passwords or codes in your submission.",
      },
      {
        title: "Plan for access and connection",
        body: "Check your data allowance before opening large files. Download permitted material when connected so you can read it later. Ask for captions, accessible documents or another format when needed. Describe an access barrier clearly and request a workable alternative.",
        resource:
          "Practice: write your preferred learning format, a backup for poor connectivity and one support request.",
      },
    ],
    quiz: [
      {
        question: "Which filename will be easiest to find later?",
        options: [
          "Document1",
          "Untitled",
          "Market-budget-October",
          "New-file-final-new",
        ],
        answer: 2,
      },
      {
        question:
          "Someone asks for your one-time sign-in code. What should you do?",
        options: [
          "Send it quickly",
          "Keep it private and verify the request separately",
          "Post it in a group",
          "Send half of it",
        ],
        answer: 1,
      },
      {
        question: "What helps you judge a search result?",
        options: [
          "It appears first",
          "It has bright colours",
          "Its author, date and supporting evidence",
          "It demands an immediate download",
        ],
        answer: 2,
      },
      {
        question:
          "A document is difficult to read. What is a useful next step?",
        options: [
          "Ask for an accessible format or adjust display settings",
          "Stop learning permanently",
          "Share your password",
          "Ignore the problem",
        ],
        answer: 0,
      },
    ],
    assignment:
      "Create a digital learning plan with a clear folder and filename, an accessibility setting, an account-safety checklist without secrets, a backup for low connectivity and a short message requesting help from a mentor. Paste your work into the assignment box.",
  },
  {
    id: "spreadsheet-data",
    category: 'digital',
    delivery: 'self-paced',
    title: "Spreadsheet and Data Skills",
    description:
      "Organise a small dataset, calculate totals and explain results with care.",
    tag: "Build a useful skill",
    skills: [
      "Spreadsheets",
      "Data quality",
      "Basic analysis",
      "Clear reporting",
    ],
    status: "published",
    consultantId: "expert-demo",
    lessons: [
      {
        title: "Build a tidy table",
        body: "A spreadsheet has rows, columns and cells. Put one observation in each row and one type of information in each column. A sales log can use Date, Item, Quantity and Unit price. Use a single header row and avoid merged cells in the data table.",
        resource:
          "Practice: enter five fictional sales, one per row. Label the currency used for prices.",
      },
      {
        title: "Check before calculating",
        body: "Use one date format, numeric quantities and consistent item names. A blank cell can mean unknown rather than zero. Confirm whether duplicate entries represent separate sales. Keep the original data and document corrections.",
        resource:
          "Practice: add one duplicate and one missing price to your fictional table. Explain how you would resolve each.",
      },
      {
        title: "Use formulas for repeat work",
        body: "A formula begins with an equals sign. With quantity in C2 and price in D2, =C2*D2 calculates the sale amount. Copy it down and check that row references change. =SUM(E2:E6) adds five amounts. Check one result by hand.",
        resource:
          "Practice: create an Amount column and total. Compare the total with a manual calculation.",
      },
      {
        title: "Sort and filter safely",
        body: "Sorting changes row order. Filtering shows rows matching a condition. Select the whole table before sorting so each sale stays together. Filter to one item and then clear the filter. Hidden rows still exist and some formulas include them.",
        resource:
          "Practice: sort the table by date, filter to one item and describe what is visible.",
      },
      {
        title: "Choose a readable chart",
        body: "Use a bar chart to compare item totals and a line chart for change over time. Give it a title and label the units. Use readable labels and do not rely on colour alone. Start a bar chart value axis at zero so bar lengths represent differences fairly.",
        resource:
          "Practice: sketch or create a bar chart of sales by item. Add a sentence describing the largest value.",
      },
      {
        title: "Explain what the data can say",
        body: "Report the period, record count and units. Higher recorded sales do not by themselves explain why sales increased. Mention missing or uncertain records. Use fictional or anonymised data for practice and avoid sharing private customer details.",
        resource:
          "Practice: write three sentences with a result, its scope and one limitation.",
      },
    ],
    quiz: [
      {
        question: "What should one row in a sales table represent?",
        options: [
          "Unrelated notes",
          "One sale",
          "Every sale in one cell",
          "Only a heading",
        ],
        answer: 1,
      },
      {
        question: "Which formula multiplies C2 by D2?",
        options: ["=C2+D2", "=SUM(C2:D2)", "=C2*D2", "C2 D2"],
        answer: 2,
      },
      {
        question: "How should you treat a missing price?",
        options: [
          "Always use zero",
          "Delete the spreadsheet",
          "Check its meaning and document the decision",
          "Assume the highest price",
        ],
        answer: 2,
      },
      {
        question: "What keeps cells from the same sale together when sorting?",
        options: [
          "Sort only the price column",
          "Select the whole table",
          "Remove the headers",
          "Merge every row",
        ],
        answer: 1,
      },
      {
        question:
          "Recorded sales increased. What can you conclude from that alone?",
        options: [
          "An advert caused it",
          "Every customer is satisfied",
          "Recorded sales increased during the stated period",
          "Future sales are guaranteed",
        ],
        answer: 2,
      },
    ],
    assignment:
      "Create a fictional sales table with at least five rows and labelled currency. Calculate each amount and the total, check one calculation by hand and describe a data-quality check. Paste the table and a three-sentence report into the assignment box, stating the period and one limitation.",
  },
  {
    id: "business-foundations",
    category: 'business',
    delivery: 'self-paced',
    title: "Small-Business Foundations",
    description:
      "Turn a simple idea into a customer offer, a budget and a small test.",
    tag: "Put skills to work",
    skills: [
      "Customer research",
      "Budgeting",
      "Business planning",
      "Customer service",
    ],
    status: "published",
    consultantId: "expert-demo",
    lessons: [
      {
        title: "Choose a customer and a problem",
        body: "Start with a specific customer group and a problem you can solve. Local traders, for example, may need clear daily sales records. Ask how people handle that problem today. Listen before describing your idea. A compliment does not prove someone will pay.",
        resource:
          "Practice: write your customer group, their problem and three open questions.",
      },
      {
        title: "Describe your offer clearly",
        body: "Explain what the customer receives, when it arrives and the price. Keep your first offer small enough to deliver reliably. State what is included and what costs extra. Choose contact and delivery methods customers can use. Ask about access needs without making assumptions.",
        resource:
          "Practice: write an offer with a deliverable, turnaround time and price.",
      },
      {
        title: "Know your costs and margin",
        body: "List costs that change with each sale, such as materials, and costs paid over a period, such as rent. A sale of 3,000 naira with a direct cost of 2,000 naira leaves 1,000 naira before other costs. Include your time in planning. Revenue is not profit.",
        resource:
          "Practice: budget for three fictional sales. Show revenue, direct costs and other costs separately.",
      },
      {
        title: "Keep simple money records",
        body: "Record money in and out with a date, description and amount. Keep receipts where possible. Separate business and personal spending in your records. Check cash against the record regularly. A payment promised for later is not cash available today.",
        resource:
          "Practice: record five fictional transactions and calculate cash remaining from a stated opening balance.",
      },
      {
        title: "Test with a small commitment",
        body: "Choose one assumption, such as whether traders want a weekly record-keeping service. Set a budget limit and time limit. Explain the offer honestly and collect feedback with permission. Count enquiries and purchases separately. Decide what result would justify continuing.",
        resource:
          "Practice: design a one-week test with a budget limit, customer group and measurable success condition.",
      },
      {
        title: "Build trust and improve",
        body: "Confirm price and delivery expectations before accepting an order. Tell the customer early if something changes. Provide a way to raise concerns and keep customer details private. Ask a specific feedback question after delivery. Review your records and choose one improvement.",
        resource:
          "Practice: draft an order confirmation and a reply to a late-delivery complaint.",
      },
    ],
    quiz: [
      {
        question: "Which is a useful customer-research question?",
        options: [
          "You love my idea, correct?",
          "How do you handle this problem today?",
          "Why have you not bought already?",
          "Can you guarantee ten sales?",
        ],
        answer: 1,
      },
      {
        question:
          "A 3,000 naira sale has a 2,000 naira direct cost. What remains before other costs?",
        options: [
          "5,000 naira",
          "2,000 naira",
          "1,000 naira",
          "3,000 naira after all costs",
        ],
        answer: 2,
      },
      {
        question: "Which is available cash today?",
        options: [
          "A possible future order",
          "An unpaid promise",
          "Money received and still held",
          "Next year’s target",
        ],
        answer: 2,
      },
      {
        question: "What makes a small test useful?",
        options: [
          "Unlimited spending",
          "An assumption, budget, time limit and success condition",
          "Counting only compliments",
          "No records",
        ],
        answer: 1,
      },
      {
        question: "You expect an order to be late. What should you do?",
        options: [
          "Ignore the customer",
          "Delete the order record",
          "Explain early and agree on the next step",
          "Promise a date you cannot meet",
        ],
        answer: 2,
      },
    ],
    assignment:
      "Write a plan for a fictional small business: customer and problem, offer and price, budget for three sales, one-week test with a spending limit and success condition, and a customer-service message. Label assumptions and explain one risk to check before spending money.",
  },
  {
    id: "ai-essentials",
    category: 'digital',
    delivery: 'self-paced',
    title: "AI Essentials",
    description: "Use AI thoughtfully for learning, work and business: write clear prompts, check outputs and protect private information.",
    tag: "Build AI confidence",
    skills: ["AI literacy", "Clear prompting", "Output checking", "Responsible AI use"],
    status: "published",
    consultantId: "expert-demo",
    lessons: [
      {
        title: "Understand what AI can and cannot do",
        body: "Artificial intelligence is software that uses patterns in data to perform tasks. Generative AI produces text, images or other content from instructions called prompts. It can help draft a message or suggest ideas, but a fluent answer may be wrong. It does not know your circumstances unless you describe them, and it should not decide your abilities or opportunities. You remain responsible for what you use. This course uses written examples; no live AI account, paid tool or internet experiment is required.",
        resource: "Practice: choose one useful task, such as drafting a fictional customer message, and one decision that needs a person's judgement. Explain the difference.",
      },
      {
        title: "Write a clear prompt",
        body: "A useful prompt describes the task, relevant context, limits and the format you want. Use fictional details. Example: 'Draft a polite message for a fictional sewing service. Explain that delivery will take three days. Use five short sentences and do not invent a price.' Compare that with 'Write something for my business.' Ask for a revision when the first draft is unclear. A detailed prompt improves direction but does not guarantee accuracy.",
        resource: "Practice: write a prompt for a fictional learning or work task. Include the task, context, one limit and the requested format. Then revise it for plain language.",
      },
      {
        title: "Check before using an answer",
        body: "AI can invent facts, references or calculations. Treat an output as a draft. Sample output: 'Three bags at 2,000 naira each total 8,000 naira.' Calculate the total yourself: 3 × 2,000 is 6,000. Check factual claims against an original trustworthy source and open any cited source to see whether it supports the claim. If you cannot verify something, mark it uncertain or remove it. Ask a qualified person to review important decisions.",
        resource: "Practice: correct the sample total. For the fictional claim 'Every applicant is guaranteed a job', explain what evidence you would need and why you would remove an unsupported guarantee.",
      },
      {
        title: "Protect privacy and respect other people's work",
        body: "Use fictional or anonymised practice details. Do not paste passwords, sign-in codes, identity documents, medical records or private customer lists into an AI tool. Removing a name alone may not hide someone's identity. Before using a real service, check its data controls and your permission to share the material. Ask permission before using another person's work or likeness. Explain when AI helped produce work where your teacher, client or workplace expects disclosure.",
        resource: "Practice: replace a fictional customer's name, phone number and address with placeholders. Write a short disclosure: 'I used AI to help draft this example and checked the final text myself.'",
      },
      {
        title: "Use AI for access while checking fairness",
        body: "You can request shorter sentences, step-by-step instructions or a text description. Check that a simplified draft keeps the original meaning. Example: 'Send the report by Friday' should not become 'Send the report whenever you can.' AI may make unfair assumptions about disability, gender or language. Do not accept a suggestion that someone cannot learn or work because of a disability. Describe the support needed and choose an accessible format with the learner. Generated captions or descriptions also need checking.",
        resource: "Practice: rewrite 'Complete the registration procedure prior to commencing instruction' as clear steps. Describe one way to check the meaning and one way to offer a keyboard or text alternative.",
      },
      {
        title: "Build a small human-reviewed workflow",
        body: "Choose a small task: a fictional job-application message, a customer reply, a study plan or teaching notes. First decide the goal and prepare safe inputs. Then write a prompt, inspect the draft, verify claims and calculations, revise it and decide whether to use it. Keep a note of what you changed and ask a person for feedback. Use accessible formats and a practical alternative when a tool is unavailable. AI should support your chosen route into work or learning; it does not guarantee income, employment or funding.",
        resource: "Practice: outline your task, fictional inputs, prompt, checking steps, edits, human review and a backup that works without an AI connection.",
      },
    ],
    quiz: [
      { question: "An AI answer sounds confident. What should you do before using its factual claims?", options: ["Assume confidence proves accuracy", "Check the claims against trustworthy original sources", "Share it immediately", "Remove all questions"], answer: 1 },
      { question: "Which prompt gives the clearest direction?", options: ["Do something useful", "Write anything", "Draft a fictional customer reply in five short sentences; do not invent a price", "Guess my private details"], answer: 2 },
      { question: "Which information is suitable for a practice prompt?", options: ["A customer's private phone number", "A password", "A medical record", "Fictional details and placeholders"], answer: 3 },
      { question: "AI says three items at 2,000 naira each cost 8,000 naira. What is the checked total?", options: ["6,000 naira", "8,000 naira", "5,000 naira", "The AI total must be right"], answer: 0 },
      { question: "An AI draft assumes a person with a disability cannot learn. What is a useful response?", options: ["Accept the assumption", "Hide the learning options", "Reject the assumption and discuss the person's goals and access needs", "Let AI choose their future"], answer: 2 },
    ],
    assignment: "Prepare a human-reviewed AI workflow for a fictional learning, employment, freelancing, business or teaching task. Include the task and safe inputs; a prompt with context, limits and format; a labelled sample draft you write yourself (or optional AI draft with its use disclosed); two checks including the 3 × 2,000 naira calculation and an unsupported claim you remove; your revised text; an accessibility choice; a privacy/disclosure note; and a backup without a live AI tool. Paste your work below. No live AI, paid account or real personal data is required.",
  },
  ...additionalSkillCourses,
];
