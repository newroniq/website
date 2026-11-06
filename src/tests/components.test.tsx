import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from '../app/App';
import { Capabilities } from '../components/sections/Capabilities';
import { home } from '../lib/content/home';
import { site } from '../lib/content';
describe('content-driven application', () => {
  it('preserves all capability destinations and supports additional cards', () => {
    render(
      <Capabilities
        items={[
          ...home.capabilities,
          {
            ...home.capabilities[0],
            title: 'Additional capability',
            benefits: ['New benefit'],
          },
        ]}
      />,
    );
    expect(screen.getAllByRole('article')).toHaveLength(5);
    for (const card of screen.getAllByRole('article')) {
      expect(within(card).getByRole('link')).toHaveAttribute(
        'href',
        '/contact/',
      );
    }
    expect(screen.getByText('New benefit')).toBeVisible();
  });
  it('opens and closes the accessible mobile navigation', async () => {
    const user = userEvent.setup();
    render(<App path="/" />);
    const menu = screen.getByRole('button', { name: site.menuLabel });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    const mobile = screen.getByRole('navigation', { name: 'Mobile' });
    expect(
      within(mobile).getByRole('link', { name: 'Services' }),
    ).toHaveAttribute('href', '/#services');
    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
  it('exposes contact validation and never claims a successful delivery', () => {
    render(<App path="/contact/" />);
    expect(
      screen.getByRole('textbox', { name: site.form.name }),
    ).toBeRequired();
    const email = screen.getByRole('textbox', { name: site.form.email });
    expect(email).toHaveAttribute('type', 'email');
    expect(screen.getByText(site.form.notice)).toBeVisible();
    expect(screen.queryByText('Message Sent.')).not.toBeInTheDocument();
  });
  it('renders article content safely and provides a real back link', () => {
    render(<App path="/whitepapers/paper-aec/" />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Map the journey before mapping the systems',
      }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Modernise the Enterprise One Business Journey at a Time',
    );
    expect(
      screen.getByRole('link', { name: /All White Papers/ }),
    ).toHaveAttribute('href', '/whitepapers/');
  });
  it('shows a useful unsupported-route page', () => {
    render(<App path="/missing/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      site.notFound.title,
    );
    expect(
      screen.getByRole('link', { name: site.notFound.homeLabel }),
    ).toHaveAttribute('href', '/');
  });
});
