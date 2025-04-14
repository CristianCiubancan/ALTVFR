# Tests Directory

This directory contains test utilities and shared test code for the Alt:V React Framework.

## Directory Structure

- **mocks/** - Mock objects for testing
- **fixtures/** - Test fixtures
- **utils/** - Test utility functions

## Testing Guidelines

1. Use Vitest for unit testing
2. Write tests for all critical functionality
3. Use the mocks provided in this directory for Alt:V API testing
4. Focus on behavior testing, not implementation details
5. Keep tests simple, readable, and maintainable
6. Use descriptive test names
7. Group related tests with `describe` blocks
8. Test edge cases and error conditions

## Testing Components

1. Test component rendering
2. Test component props
3. Test component interactions
4. Test component accessibility
5. Test component lifecycle

## Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/ui/components/common/Button';
import { mockAltClient } from './mocks/alt-mock';

describe('Button', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAltClient.reset();
  });
  
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```