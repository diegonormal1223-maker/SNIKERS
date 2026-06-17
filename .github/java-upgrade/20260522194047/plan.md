# Upgrade Plan: snikers-app (20260522194047)

- **Generated**: 2026-05-22 19:40:47
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 21.0.8: C:\Program Files\Java\jdk-21\bin

**Build Tools**
- Maven: **<TO_BE_INSTALLED>** (required by Step 1; no system Maven installation found)
- maven-compiler-plugin 3.11.0: already configured for Java 21
- spring-boot-maven-plugin 3.2.3: already configured and compatible with Java 21

## Guidelines

- Upgrade Java runtime to the latest LTS version, Java 21.
- Preserve the current Spring Boot 3.2.3 configuration.
- Keep changes minimal and focused on the toolchain alignment needed to validate Java 21.

## Options

- Working branch: appmod/java-upgrade-20260522194047
- Run tests before and after the upgrade: true

## Upgrade Goals

- Upgrade Java runtime to Java 21 (latest LTS)

### Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 21 | 21 | - |
| Spring Boot parent | 3.2.3 | 3.2.x | already compatible with Java 21 |
| Maven | not installed | 3.9+ | required to build and verify Java 21 project |
| maven-compiler-plugin | 3.11.0 | 3.11.0 | already compatible with Java 21 |
| spring-boot-maven-plugin | 3.2.3 | 3.2.x | already compatible with Java 21 |

### Derived Upgrades

- Install Maven 3.9+ because no system Maven installation was found and Maven is required to validate the Java 21 project.
- No source-level Java version changes are required because the project already targets Java 21 in `pom.xml`.

## Upgrade Steps

- **Step 1: Setup Environment**
  - **Rationale**: The project is already configured for Java 21, but the local environment lacks Maven, so the upgrade cannot be validated until Maven is present.
  - **Changes to Make**:
    - [ ] Install Maven 3.9+ using `#appmod-install-maven`
    - [ ] Confirm `mvn` is available and working
    - [ ] Confirm JDK 21 exists at `C:\Program Files\Java\jdk-21\bin`
  - **Verification**:
    - Command: `mvn -version`
    - Expected Result: Maven is installed and reports compatibility with Java 21.

- **Step 2: Setup Baseline**
  - **Rationale**: Establish the build and test baseline using the existing Java 21 configuration before making any modifications.
  - **Changes to Make**:
    - [ ] Run `mvn clean test-compile -q` with JDK 21
    - [ ] Run `mvn clean test -q` with JDK 21
  - **Verification**:
    - Command: `mvn clean test -q`
    - Expected Result: Compilation succeeds and tests pass.

- **Step 3: Final Validation**
  - **Rationale**: Confirm that the Java runtime upgrade goal is met and the project is stable under Java 21.
  - **Changes to Make**:
    - [ ] Verify `pom.xml` Java properties and compiler plugin target/release are set to 21
    - [ ] Run a full Maven clean test build with JDK 21
    - [ ] Resolve any remaining build or test failures
  - **Verification**:
    - Command: `mvn clean test -q`
    - Expected Result: Compilation success and 100% tests pass.

## Key Challenges

- **Missing Maven installation**
  - **Challenge**: The environment has JDK 21, but no Maven executable is available for build validation.
  - **Strategy**: Install Maven 3.9+ in Step 1 and verify `mvn -version` before proceeding.

- **No version control available**
  - **Challenge**: The workspace is not a Git repository, so changes cannot be tracked via git operations.
  - **Strategy**: Track the upgrade through the `.github/java-upgrade/20260522194047` artifacts and direct file updates.

- **Toolchain validation rather than source migration**
  - **Challenge**: The project already targets Java 21, so the primary task is validating the runtime and build tools rather than migrating code.
  - **Strategy**: Focus on environment alignment, build verification, and test execution.
