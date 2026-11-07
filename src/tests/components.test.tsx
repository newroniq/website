import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach } from 'vitest';
import { App } from '../app/App';
import { Capabilities } from '../components/sections/Capabilities';
import { home } from '../lib/content/home';
import { site } from '../lib/content';
import { getInquiry } from '../lib/content/inquiries';
afterEach(() => window.history.replaceState({}, '', '/'));
describe('content-driven application', () => {
  it('connects each service to its inquiry and renders editorial benefits', () => {
    render(
      <Capabilities
        items={home.capabilities.map((item, index) =>
          index === 0
            ? { ...item, benefits: ['A focused business benefit'] }
            : item,
        )}
      />,
    );
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
    cards.forEach((card, index) => {
      expect(within(card).getByRole('heading')).toHaveTextContent(
        getInquiry(home.capabilities[index].inquiryId).label,
      );
      expect(within(card).getByRole('link')).toHaveAttribute(
        'href',
        `/contact/?inquiry=${home.capabilities[index].inquiryId}`,
      );
    });
    expect(screen.getByText('A focused business benefit')).toBeVisible();
  });
  it('closes mobile navigation with Escape and returns keyboard focus', async () => {
    const user = userEvent.setup();
    render(<App path="/" />);
    const menu = screen.getByRole('button', { name: site.menuLabel });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(
      within(screen.getByRole('navigation', { name: 'Mobile' })).getByRole(
        'link',
        { name: 'Services' },
      ),
    ).toHaveAttribute('href', '/#services');
    await user.keyboard('{Escape}');
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveFocus();
  });
  it('preselects product interest and permits changing back to a general inquiry', async () => {
    window.history.replaceState({}, '', '/contact/?inquiry=stylepulse');
    const user = userEvent.setup();
    render(<App path="/contact/" />);
    expect(screen.getByRole('combobox')).toHaveValue('stylepulse');
    expect(
      screen.getByRole('textbox', { name: site.form.name }),
    ).toHaveAttribute('pattern', '.*\\S.*');
    expect(screen.getByRole('note')).toHaveTextContent(
      'interest in StylePulse',
    );
    expect(
      screen.getByRole('textbox', { name: site.form.name }),
    ).toBeRequired();
    expect(
      screen.getByRole('textbox', { name: site.form.organisation }),
    ).not.toBeRequired();
    await user.selectOptions(screen.getByRole('combobox'), 'general');
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    expect(screen.queryByText('Message Sent.')).not.toBeInTheDocument();
  });
  it('treats unknown query values as general inquiries without rendering input', () => {
    window.history.replaceState({}, '', '/contact/?inquiry=%3Cscript%3E');
    render(<App path="/contact/" />);
    expect(screen.getByRole('combobox')).toHaveValue('general');
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
  it('keeps article routes, genuine references and the insight back link', () => {
    render(<App path="/whitepapers/paper-aec/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Modernise the Enterprise One Business Journey at a Time',
    );
    expect(screen.getByRole('link', { name: /All Insights/ })).toHaveAttribute(
      'href',
      '/whitepapers/',
    );
    expect(
      screen.getByRole('link', { name: /Microsoft Learn/ }),
    ).toHaveAttribute(
      'href',
      'https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig',
    );
  });
  it('displays the official contact and verified company information with privacy access', () => {
    render(<App path="/privacy/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Privacy Policy',
    );
    expect(
      screen.getAllByRole('link', { name: site.email })[0],
    ).toHaveAttribute('href', 'mailto:info@newroniq.com');
    expect(screen.getByText(/Company number: 17181252/)).toBeVisible();
  });
  it('provides a supported-route recovery link on 404', () => {
    render(<App path="/missing/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      site.notFound.title,
    );
    expect(
      screen.getByRole('link', { name: site.notFound.homeLabel }),
    ).toHaveAttribute('href', '/');
  });
});
