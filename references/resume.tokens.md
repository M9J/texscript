Absolutely, let's break down your code into tokens and their types. Here's a detailed look:

### Tokens and Their Types

1. **Keywords**:
   - `Page`, `Section`, `Block`, `Line`, `List`

2. **Identifiers**:
   - `main`, `name`, `contactInfo`, `contactInfoRight`, `careerTitle`, `careerDetails`, `careerPosition`, `responsibilities`, `skillsTitle`, `skillsDetails`, `educationTitle`, `educationDetails`, `educationInstitution`

3. **Operators and Punctuation**:
   - `(`, `)`, `[`, `]`, `:`, `,`

4. **Special Tokens**:
   - `--`, `::`

5. **Strings**:
   - `"John Doe"`, `"john.doe@example.com"`, `"+1 (234) 567-8900"`, `"Los Angeles, California"`, `"United States 90009"`, `"CAREER"`, `"2020 - PRESENT"`, `"Staff Engineer, Google, California"`, `"Responsible for the development, testing, deployment and debugging of Google Cloud infrastructure UI application."`, `"Created a library for easeness of utilizing RPC calls"`, `"Maintained few archived repositories of Google Cloud Platform (GCP)"`, `"Recognized for conducting thorough unit tests for several mission critical modules"`, `"2015 - 2020"`, `"Senior Engineer, Amazon, Seattle"`, `"Developed the database-application API for Amazon Web Services (AWS) which helped new developers to onboard way more easier than before."`, `"SKILLS"`, `"Java, Rust, SQL, HTML, CSS, JavaScript, TypeScript, C++, MongoDB, Node.js"`, `"EDUCATION"`, `"M.S. Computer Science"`, `"Massachusetts Institute of Technology"`, `"Cambridge, Massachusetts"`, `"United States"`, `"B.S. Computer Science"`, `"Harvard University"`

6. **Attributes**:
   - `size: A4`
   - `type: bullet`

### Example Tokenization

- `Page.main` -> `Page` (Keyword), `.` (Punctuation), `main` (Identifier)
- `Section.name: "John Doe"` -> `Section` (Keyword), `.` (Punctuation), `name` (Identifier), `:` (Punctuation), `"John Doe"` (String)
- `Section.contactInfo [ Block [ "john.doe@example.com" "+1 (234) 567-8900" ] Block.contactInfoRight [ "Los Angeles, California" "United States 90009" ] ]` -> Breaking this down similarly.
