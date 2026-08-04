# Data Model

Version: 1.0

---

# Purpose

The purpose of this document is to define the core business entities of the platform.

This is the single source of truth for the data model.

All services, APIs, AI workflows, and UI components should be designed around these entities.

---

# Design Philosophy

We do not build a video library.

We build a knowledge platform.

Videos are temporary.

Knowledge compounds forever.

Every imported video becomes one Knowledge Unit.

---

# Core Entity

Knowledge Unit

Knowledge Unit represents one complete piece of structured business knowledge.

Everything else either produces or consumes Knowledge Units.

Examples

Video

↓

Knowledge Unit

↓

Story Generator

Website

Newsletter

Analytics

Digital Product

---

# Domain Model

The system consists of the following domains.

Content

Knowledge

Generation

Publishing

Analytics

Revenue

Automation

Every entity belongs to one domain.

Avoid cross-domain responsibilities.

---

# Core Entities

KnowledgeUnit

Story

Hook

Emotion

Topic

Character

CTA

MediaAsset

Performance

Revenue

Tag

Prompt

Embedding

Relationship

WebsiteContent

ProductIdea

AffiliateIdea

---

# Knowledge Unit

KnowledgeUnit is the heart of the platform.

Fields

id

title

summary

language

country

status

createdAt

updatedAt

---

Relationships

One KnowledgeUnit

has one Story

has many Hooks

has many Emotions

has many Characters

has many Topics

has many CTAs

has many Tags

has one Performance

has one Revenue

has many Prompt Templates

has one Embedding

has many Website Articles

has many Product Ideas

---

# Story

Represents the narrative extracted by AI.

Fields

storyType

beginning

middle

ending

conflict

resolution

lesson

estimatedLength

qualityScore

---

# Hook

Represents attention-grabbing openings.

Fields

text

type

curiosityPattern

emotion

strengthScore

retentionScore

---

# Emotion

Represents emotional analysis.

Fields

primaryEmotion

secondaryEmotion

intensity

sentiment

audienceReaction

---

# Character

Fields

name

role

relationship

personality

importance

---

# CTA

Represents call-to-action opportunities.

Fields

type

text

goal

expectedResult

priority

---

# Topic

Fields

name

category

confidence

---

# Performance

Performance metrics collected after publishing.

Fields

views

reach

likes

comments

shares

followers

watchTime

retention

completionRate

publishedAt

---

# Revenue

Tracks monetization performance.

Fields

affiliateClicks

affiliateRevenue

productRevenue

subscriptionRevenue

totalRevenue

conversionRate

---

# Media Asset

Represents original media.

Fields

videoUrl

thumbnail

duration

resolution

audio

subtitle

ocr

---

# Embedding

Stores semantic representation.

Fields

provider

model

dimension

vector

version

---

# Prompt

Reusable AI prompt.

Fields

name

purpose

template

variables

model

version

---

# Website Content

Represents generated website pages.

Fields

title

slug

content

seoTitle

seoDescription

status

---

# Product Idea

Represents monetization opportunities.

Fields

title

category

description

estimatedValue

difficulty

priority

---

# Affiliate Idea

Represents affiliate opportunities.

Fields

product

reason

audienceFit

confidence

priority

---

# Tags

Tags classify knowledge.

Examples

Family

Marriage

Proposal

Transformation

Hope

Forgiveness

Parenting

Love

Reunion

Faith

---

# Relationships

KnowledgeUnit

↓

Story

↓

Emotion

↓

Hook

↓

Topic

↓

CTA

↓

Performance

↓

Revenue

↓

Generation

Knowledge remains the center.

---

# Lifecycle

Import

↓

AI Analysis

↓

Knowledge Extraction

↓

Human Review

↓

Publishing

↓

Performance Collection

↓

Learning

↓

Recommendation

Knowledge continuously evolves.

---

# Design Rules

Never duplicate business data.

Store facts once.

Reference everywhere else.

Every entity has one clear responsibility.

Avoid giant tables.

Prefer small, well-defined aggregates.

---

# Future Extensions

The model should support:

Multiple Languages

Multiple Social Platforms

Website

Email

Courses

Digital Products

Creator SaaS

Without changing the core model.

---

# Final Principle

Everything starts with content.

Everything ends as knowledge.

Knowledge is the most valuable asset of the platform.
