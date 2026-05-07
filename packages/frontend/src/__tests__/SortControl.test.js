import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SortControl from '../components/SortControl';

describe('SortControl', () => {
  test('displays A → Z when sortOrder is asc', () => {
    render(<SortControl sortOrder="asc" onToggle={jest.fn()} />);
    expect(screen.getByText(/A → Z/)).toBeInTheDocument();
  });

  test('displays Z → A when sortOrder is desc', () => {
    render(<SortControl sortOrder="desc" onToggle={jest.fn()} />);
    expect(screen.getByText(/Z → A/)).toBeInTheDocument();
  });

  test('calls onToggle when button is clicked', async () => {
    const onToggle = jest.fn();
    render(<SortControl sortOrder="asc" onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: /sort todos/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
