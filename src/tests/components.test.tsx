import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach } from 'vitest';
import { App } from '../app/App';
import { Capabilities } from '../components/sections/Capabilities';
import { advisory } from '../lib/content/advisory';
import { ResearchMetadata } from '../components/common/ResearchMetadata';
import { site } from '../lib/content';
afterEach(() => window.history.replaceState({}, '', '/'));
describe('content-driven application', () => {
  it('keeps the original tagline beneath the footer wordmark and separate from the homepage headline', () => {
    render(<App path="/" />);
    expect(site.tagline).toBe('Think Bold. Build Reality.');
    const footer = screen.getByRole('contentinfo');
    const wordmark = within(footer).getByText('NEWRON', {
      exact: true,
    }).parentElement!;
    expect(wordmark.parentElement?.nextElementSibling).toHaveTextContent(
      /^Think Bold\. Build Reality\.$/,
    );
    expect(
      within(footer).getAllByText('Think Bold. Build Reality.', {
        exact: true,
      }),
    ).toHaveLength(1);
    expect(
      within(footer).getByText('Making Enterprise AI Work in the Real World.', {
        exact: true,
      }),
    ).toBeVisible();
    expect(
      within(footer).queryByText('From AI Ambition to Enterprise Reality.'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /^From AI Ambition to Enterprise Reality\.$/,
    );
  });
  it('connects each service to its detail and consultation context', () => {
    render(<Capabilities />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(4);
    cards.forEach((card, index) => {
      const service = advisory.services[index];
      expect(within(card).getByRole('heading')).toHaveTextContent(
        service.title,
      );
      expect(
        within(card).getByRole('link', { name: service.title }),
      ).toHaveAttribute('href', `/services/#${service.id}`);
      expect(
        within(card).getByRole('link', {
          name: 'Discuss this advisory service',
        }),
      ).toHaveAttribute('href', `/contact/?inquiry=${service.id}`);
    });
  });
  it.each([
    [undefined, undefined, ''],
    ['Contributor', undefined, 'Contributor'],
    [undefined, '2026-11-06', '2026-11-06'],
    ['Contributor', '2026-11-06', 'Contributor · 2026-11-06'],
  ])('renders optional metadata: %s / %s', (author, publishedOn, expected) => {
    const { container } = render(
      <ResearchMetadata author={author} publishedOn={publishedOn} />,
    );
    expect(container.textContent).toBe(expected);
    if (publishedOn)
      expect(container.querySelector('time')).toHaveAttribute(
        'dateTime',
        publishedOn,
      );
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
        { name: 'AI Advisory' },
      ),
    ).toHaveAttribute('href', '/services/');
    await user.keyboard('{Escape}');
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveFocus();
  });
  it('retains product context without pretending an unconfigured form can submit', () => {
    window.history.replaceState({}, '', '/contact/?inquiry=stylepulse');
    render(<App path="/contact/" />);
    expect(screen.getByRole('note')).toHaveTextContent('StylePulse');
    expect(
      screen.getByText(site.form.unavailable, { exact: false }),
    ).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByText(site.form.success)).not.toBeInTheDocument();
  });
  it('ignores arbitrary enquiry parameters', () => {
    window.history.replaceState({}, '', '/contact/?inquiry=%3Cscript%3E');
    render(<App path="/contact/" />);
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
