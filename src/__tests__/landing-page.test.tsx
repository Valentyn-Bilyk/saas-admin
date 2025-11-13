import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import LandingPage from '@app/page';

describe('LandingPage', () => {
  it('renders title', () => {
    render(<LandingPage />);
    expect(screen.getByText('SaaS Admin – Teams & Billing')).toBeInTheDocument();
  });
});
