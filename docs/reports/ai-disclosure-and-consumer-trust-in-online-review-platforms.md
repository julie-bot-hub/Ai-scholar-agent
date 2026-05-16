# AI Scholar Agent Report

## Query
- Topic: AI disclosure and consumer trust in online review platforms
- Domains: marketing, is
- Keywords: AI, disclosure, consumer, trust, online, review, platforms

## Retrieval Log
- OpenAlex candidates: 50
- After journal filter: 5
- Allowed journals: Journal of Marketing Research; Journal of Consumer Research; Marketing Science; Journal of Marketing; Journal of Retailing; Journal of Product Innovation Management; Journal of Consumer Psychology; Journal of the Academy of Marketing Science; MIS Quarterly; Information Systems Research; Journal of Management Information Systems; Information & Management; Decision Support Systems; Journal of AIS

## Retrieval Attempts

### Attempt 1
- Query: AI disclosure consumer trust online review platforms
- OpenAlex candidates: 20
- After journal filter: 3

### Attempt 2
- Query: AI disclosure and consumer trust in online review platforms
- OpenAlex candidates: 50
- After journal filter: 5


## Top Papers

### 1. Consumers and Artificial Intelligence: An Experiential Perspective
- Journal: Journal of Marketing
- Year: 2020
- DOI: 10.1177/0022242920953847
- DOI valid: true
- Access status: open_access
- PDF URL: https://eprints.lancs.ac.uk/id/eprint/157428/1/Consumers_and_Artificial_Intelligence.pdf
- Landing page: https://doi.org/10.1177/0022242920953847
- Citations: 976
- Relevance score: 0.286
- Score: 0.583
- OpenAlex ID: https://openalex.org/W3081261125

#### Comparison
- Matched keywords: AI, consumer
- Missing keywords: disclosure, trust, online, review, platforms
- Common points:
  - The paper directly overlaps with these topic terms: AI, consumer.
  - The paper appears in an allowed target journal (Journal of Marketing).
- Differences:
  - The paper metadata does not explicitly cover these query terms: disclosure, trust, online, review, platforms.
  - The paper is open access, so full-text review is feasible without institutional login.
- Research gap: A useful gap is to connect AI, consumer with disclosure, trust, online in the context of "AI disclosure and consumer trust in online review platforms".

### 2. A strategic framework for artificial intelligence in marketing
- Journal: Journal of the Academy of Marketing Science
- Year: 2020
- DOI: 10.1007/s11747-020-00749-9
- DOI valid: true
- Access status: open_access
- PDF URL: https://link.springer.com/content/pdf/10.1007/s11747-020-00749-9.pdf
- Landing page: https://doi.org/10.1007/s11747-020-00749-9
- Citations: 1474
- Relevance score: 0.143
- Score: 0.511
- OpenAlex ID: https://openalex.org/W3094793347

#### Comparison
- Matched keywords: AI
- Missing keywords: disclosure, consumer, trust, online, review, platforms
- Common points:
  - The paper directly overlaps with these topic terms: AI.
  - The paper appears in an allowed target journal (Journal of the Academy of Marketing Science).
- Differences:
  - The paper metadata does not explicitly cover these query terms: disclosure, consumer, trust, online, review.
  - The paper is open access, so full-text review is feasible without institutional login.
- Research gap: A useful gap is to connect AI with disclosure, consumer, trust in the context of "AI disclosure and consumer trust in online review platforms".

### 3. Privacy in the Digital Age: a Review of Information Privacy Research in Information Systems1
- Journal: MIS Quarterly
- Year: 2011
- DOI: 10.2307/41409971
- DOI valid: true
- Access status: open_access
- PDF URL: https://vtechworks.lib.vt.edu/bitstreams/318af51f-67ba-485f-883e-2c6e139261bf/download
- Landing page: https://doi.org/10.2307/41409971
- Citations: 1289
- Relevance score: 0.143
- Score: 0.471
- OpenAlex ID: https://openalex.org/W1870146437

#### Comparison
- Matched keywords: review
- Missing keywords: AI, disclosure, consumer, trust, online, platforms
- Common points:
  - The paper directly overlaps with these topic terms: review.
  - The paper appears in an allowed target journal (MIS Quarterly).
- Differences:
  - The paper metadata does not explicitly cover these query terms: AI, disclosure, consumer, trust, online.
  - The paper is open access, so full-text review is feasible without institutional login.
- Research gap: A useful gap is to connect review with AI, disclosure, consumer in the context of "AI disclosure and consumer trust in online review platforms".

## Critic Review

- WARNING: Only 3 ranked papers were found, fewer than the target Top 5.

## Evaluation Summary

- Requested Top K: 5
- Returned count: 3
- Top K complete: false
- Paper Validity Rate: 1
- Open Access Rate: 1
- Average Score: 0.522

## Baseline Comparison

### Baseline 1: direct LLM-style prompt
- Description: Single-step topic query without journal filtering or self-correction.
- Query: AI disclosure and consumer trust in online review platforms
- OpenAlex candidates: 20
- Returned count: 5
- Paper Validity Rate: 0
- Open Access Rate: 1
- Average Score: 0.354
### Baseline 2: keyword-only OpenAlex search
- Description: OpenAlex keyword search ranked by citations without allowed-journal filtering.
- Query: AI disclosure consumer trust online review platforms
- OpenAlex candidates: 20
- Returned count: 5
- Paper Validity Rate: 1
- Open Access Rate: 1
- Average Score: 0.609

### Proposed vs Baselines
- Proposed Paper Validity Rate: 1
- Proposed Open Access Rate: 1
- Proposed Average Score: 0.522
- Interpretation note: Average Score combines topic relevance, citation, recency, DOI validity, and open-access status, with topic relevance weighted most heavily.