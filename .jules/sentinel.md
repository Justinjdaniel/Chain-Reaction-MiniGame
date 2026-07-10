# Sentinel's Security Journal 🛡️

This journal tracks critical security learnings, vulnerability patterns, and prevention strategies discovered in this codebase.

## 2025-02-17 - Robust LocalStorage Sanitization & Prototype Pollution Protection
**Vulnerability:** Weak Schema Validation on LocalStorage reads exposing React state to unexpected types, DoS/layout breaks via long strings, or Prototype Pollution.
**Learning:** Checking `'__proto__' in parsedObj` results in a false positive because normal plain objects inherit `__proto__` from `Object.prototype`. Furthermore, `JSON.parse()` preserves `__proto__` as an own property.
**Prevention:** Rather than performing generic key checks, use `Object.prototype.hasOwnProperty.call(parsedObj, 'knownProp')` to verify expected properties. Copy these verified properties directly into a brand new object literal, discarding any unmapped properties like `__proto__`. This ensures absolute immunity to prototype lookup issues and prototype pollution.
