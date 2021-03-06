#Building an EARL-LD API

The WCAG-EM+EARL in JSON-LD API is an API to provide read and write access to EARL data writen in JSON

- `webpage`: A non-embedded resource obtained from a single URI
- `website`: A collection of webpages loosely organised around an domain name
- `assertion`: The description of the result of an (accessibility) test
- `assertor`: A person, organisation or tool, the creator of an assertion
- `evaluation`: A collection of assertions aimed to test a website


## REST API
Representational State Transfer (REST) is a software architecture style consisting of guidelines and best practices for creating scalable web services. REST is a coordinated set of constraints applied to the design of components in a distributed hypermedia system that can lead to a more performant and maintainable architecture.


### API Version
To ensure potential future API changes do not break any existing implementations the major version number is ALWAYS the first part of the
URL after the domaain. I.e. `http://uttbookmarklet.com/v1/...`.


### Request methods
For this REST API the following methods will be exposed to the public:
- `GET`: Get an object or a collection of objects
- `POST`: Create a new object

The following functions are only permitted to authenticated users.
- `PUT`: Replace an object
- `DELETE`: Remove an object
- `PATCH`: Edit an object


### API paths with GET method
URI                         | Notes
:---------------------------|:-----------------------
assertions                  |
assertions/:id              |
webpages                    |
webpages/:id                |
webpages/:id/assertions     | (reference list)
websites                    |
websites/:id                | (?include=evaluations)
websites/:id/evaluations    | (reference list)
websites/:id/webpages       | (reference list)
assertors                   |
assertors/:id/evaluations   | (reference list)
evaluations                 |
evaluations/:id             |
evaluations/:id/scope       |
evaluations/:id/creator     |
evaluations/:id/auditResult |
evaluations/:id/auditResult/:assertionId     |


### API paths with POST method
URI                         | Notes
:---------------------------|:----------------------------------
evaluations                 | Create an evaluation
evaluations/:id/auditResult | Add an assertion to an evaluation

## Options

- `include=context`: Add the context object, instead of a path to the context
- ``


## Resource Description

### Assertions
    {
      "@context":   "http://www.uttbookmarklet.com/assertions/context.jsonld",
      "@type":      "Assertion",
      "@id":        "utt:asssertions/1234567890",
      // The subject can be an evaluation.scope or a webpage
      "subject":    "utt:evaluations/123456/scope",
      "assertedBy": "utt:assertors/123456",
      "test": {
        "@type": "TestRequirement",
        "@id":   "wcag20:text-equiv-all"
      },
      "result": {
        "@type":  "TestResult",
        "outcome": "failed"
      },
      "date": "2014-01-01T19:20:30+01:00",
    }


### webpages
    {
      "@context":    "http://www.uttbookmarklet.com/webpages/context.jsonld"
      "@type":       "wcag-em:webpage",
      "@id":         "utt:webpages/123456",
      "title":       "Structure page 1",
      "source":      "http://example.com/1",
      "description": "http://example.com/1"
    }


### websites
    {
      "@context":    "http://www.uttbookmarklet.com/websites/context.jsonld"
      "@type":       "website"
      "@id":         "utt:websites/12345"
      "dct:title":   "Example Org",
      "domain":      "www.example.org",
      "evaluations": [
        "utt:evaluations/123456",
        "utt:evaluations/234567",
        "utt:evaluations/345678"
      ]
    }


### assertors
    {
      "@id":   "utt:assertors/123456",
      "@type": "http://xmlns.com/foaf/spec/#Person",
    }


### Evaluations
    {
      "@context": "http://www.uttbookmarklet.com/evaluations/context.jsonld"
      "@type":    "evaluation",
      "@id":      "utt:evaluations/123456",
      "creator":  "utt:assertors/123456",
      "date":     "2015-01-01",
      "auditResult": [{ /* as described in Assertions */ }],
      "evaluationScope": { /* as described in Evaluations.scope */ }
    }


#### Evaluations.scope
    {
      "@context": "http://www.uttbookmarklet.com/evaluations/context.jsonld"
      "conformanceTarget": "wcag20:level_aa",
      "additionalEvalRequirement": "Check if the site is cool too",
      "accessibilitySupportBaseline": "My AS Baseline",
      "website": {
        "@id":       "utt:websites/1234",
        "title":     "W3C website",
        "siteScope": [{"include": "www.example.com"}]
      }
    }


## JSON Context Files (.jsonld)
### assertions/context.jsonld
    {
      "@context": {
        "@vocab":          "http://www.uttbookmarklet.com/",
        "earl":            "http://www.w3.org/ns/earl#",
        "dct":             "http://www.w3.org/ns/earl#",
        "wcag20":          "http://www.w3.org/TR/WCAG20/#",
        "outcome":         {"@type": "@id", "@id": "earl:outcome"},
        "subject":         {"@type": "@id", "@id": "earl:subject"},
        "assertedBy":      {"@type": "@id", "@id": "earl:assertedBy"},
        "testRequirement": {"@type": "@id", "@id": "earl:testRequirement"},
        "date":            {"@id": "dct:date"},
        "result":          {"@id": "earl:result"}
      }
    }


## Authentication
URI                | URL parameters     | Description
:------------------|:-------------------|:----------------------------------------------------------
`GET /session`     | `name`, `password` | __Only via HTTPS__, retrieves new session key, requires valid owner name and password
`DELETE /session`  |                    | Closes session


# Sources of inspiration
- http://www.w3.org/TR/EARL10-Schema/
- http://json-ld.org/
- https://github.com/w3c/wcag-em-report-tool/blob/master/dataformat.md 
- https://github.com/waagsociety/citysdk-ld
- https://github.com/UKGovLD/linked-data-api/blob/wiki/Specification.md
- http://answers.semanticweb.com/questions/2763/the-relation-of-linked-datasemantic-web-to-rest