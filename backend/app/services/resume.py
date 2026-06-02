def analyze_resume(resume_text: str, target_role: str) -> tuple[int, list[str]]:
    text = resume_text.lower()
    signals = ["python", "react", "aws", "docker", "kubernetes", "sql", "fastapi", "leadership"]
    score = 45 + sum(6 for signal in signals if signal in text)
    if target_role.lower() in text:
        score += 8
    findings = []
    if len(resume_text.split()) < 250:
        findings.append("Add more quantified project and impact details.")
    if "aws" not in text:
        findings.append("Add cloud deployment experience where applicable.")
    if "%" not in resume_text and "reduced" not in text and "increased" not in text:
        findings.append("Include measurable outcomes such as latency, cost, quality, or scale improvements.")
    findings.append("Mirror target-role keywords naturally across skills, projects, and experience.")
    return min(score, 100), findings
