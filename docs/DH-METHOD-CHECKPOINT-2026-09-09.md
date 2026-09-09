# DH Method Checkpoint — 2026-09-09

## Purpose

Freeze the current understanding before further design or build work.

We are defining the introductory system RRCA needs to function as the **Founding Sponsor and first operator of the Construction Management Group** within the ClaimStore Vision, Prepare America mission, and larger Human Blockchain architecture.

The working method is:

> **Map the real-world need onto proven existing tools, then build only what is missing.**

## Architectural correction

The current repository documentation says that SAS A and SAS B replace the original SiteBMS concept. That is **not** the present understanding.

The working model is:

- **SAS A** — Technology Administration. Manages the platform technology, code, databases, identity, permissions, integrations, API/MCP surface, environments, releases, and technical record.
- **SAS B** — Platform / Human Blockchain Administration. Manages the larger stakeholder ecosystem, governance, groups, relationships, rules, assignments, platform-wide business controls, and shared market administration.
- **SiteBMS** — Construction Management Group Business Management System. The operating system used by whichever entity is assigned to manage the Construction Management Group.

For the initial implementation, **RRCA is the Founding Sponsor and first operator of the Construction Management Group and therefore the first operator of the modern SiteBMS.**

SiteBMS is not the whole platform and is not replaced by SAS A or SAS B.

## Historical reference

The architecture deliberately borrows from the original Siteforum platform used during the 2008–2011 ClaimStore / ClaimExpress development period.

That environment separated:

1. the Portal System and its administration;
2. middleware and platform services;
3. database administration;
4. the online IDE / development administration; and
5. the business-facing files, workflows, reports, and controls used by RRCA — originally described as SiteBMS.

The value of this precedent is not nostalgia. It gives us a proven architectural pattern and vocabulary so we can avoid unnecessary reinvention.

## Real-world requirements source

The **Draft Connecticut Agreement** work is the first live requirements source for the modern SiteBMS.

That work describes the operating relationship between RRCA and Frog Hollow Home Improvements and begins to define the actual rules the system must execute, including:

- company and user relationships;
- Licensed Contractor and Independent Sales Rep roles;
- lead origination and assignment;
- project responsibility;
- Contractor of Record;
- sales, inspection, estimating, production, collection, warranty, and closeout authority;
- compensation and splits;
- documentation and evidence;
- financial responsibility;
- dispute and workmanship responsibility; and
- what survives when a working relationship changes or ends.

The agreement defines the business rules. **SiteBMS must make those rules operable.**

## Existing Lovable application

The current Lovable application and repository are valuable existing assets and should not be discarded or rebuilt merely to fit a new diagram.

Relevant functionality already present includes:

- public front door and Interested User entry;
- authentication and role infrastructure;
- database and access controls;
- Kimosabe Interested User wallet / ledger concept;
- founder administration;
- an existing ISR / LC activation requirements epic; and
- an existing ClaimExpress API / MCP requirements epic.

The present repo is therefore the preferred working base until evidence shows otherwise.

## API / MCP principle

The Platform API / MCP is an integration boundary, not a reason to rebuild software that already exists.

> **SiteBMS decides what must happen. API/MCP connects SiteBMS to the systems that already know how to do it.**

**JobNimbus is the first identified external operating platform to integrate.**

The immediate sequence is:

1. Define the RRCA workflow from the Construction Manager's point of view.
2. Identify what the existing Lovable application already handles.
3. Identify what JobNimbus already handles.
4. Identify what SiteBMS must add.
5. Define the ClaimExpress objects, states, events, and permissions shared between them.
6. Define the API calls and MCP tools required to execute those transitions.

## Next working exercise

Walk through the current Lovable experience from the ground floor:

**Interested User → Certified Participant → ISR and/or LC → SiteBMS operating role**

At every step ask only:

- What does the person need to see?
- What do they need to know?
- What may they do?
- What must someone else approve?
- What system already performs the function?
- What event belongs on the shared record?

Each requirement will then be classified as one of:

- Existing Lovable functionality;
- SiteBMS functionality;
- JobNimbus / external system functionality;
- ClaimExpress API/MCP integration;
- SAS B platform administration;
- SAS A technology administration; or
- Future / not required for the introductory build.

## Build discipline

Until this walkthrough is complete:

- do not create a replacement repository;
- do not rebuild functionality merely because it exists in another system;
- do not confuse SiteBMS with platform-wide administration;
- do not expose Construction Management Group control to SAS A merely because SAS A owns the technical implementation;
- do not force future Human Blockchain requirements into the introductory RRCA application unless they are required by the live operating case.

**Start with RRCA. Make Connecticut work. Integrate what already works. Record the events. Expand only when reality requires it.**
