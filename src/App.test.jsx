import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp'

const menu = () => within(screen.getByRole('navigation', { name: 'Main menu' }))

describe('navigation menu', () => {
  it('shows all menu items', () => {
    renderApp()
    for (const label of ['Dashboard', 'Computers', 'Add Computer', 'About']) {
      expect(menu().getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('navigates between pages', async () => {
    const { user } = renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()

    await user.click(menu().getByRole('link', { name: 'Computers' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Computers' })).toBeInTheDocument()

    await user.click(menu().getByRole('link', { name: 'Add Computer' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Add computer' })).toBeInTheDocument()

    await user.click(menu().getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })

  it('shows a not-found page for unknown URLs', () => {
    renderApp('/nowhere')
    expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument()
  })
})

describe('about page', () => {
  it('lists every team member with their student ID', () => {
    renderApp('/about')
    const team = [
      ['Sultan Almojel', '222110274'],
      ['Ziyad AlIsmail', '222110392'],
      ['Nawaf AlTamimi', '222110323'],
      ['Saud Alnasser', '222110253'],
    ]
    for (const [name, id] of team) {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(`Student ID: ${id}`)).toBeInTheDocument()
    }
  })
})

describe('dashboard', () => {
  it('shows inventory statistics', () => {
    renderApp('/')
    expect(screen.getByTestId('stat-total')).toHaveTextContent('12')
  })
})

describe('display and search', () => {
  it('displays all computers in a table', () => {
    renderApp('/computers')
    expect(screen.getAllByRole('row')).toHaveLength(13) // header + 12
    expect(screen.getByText('Showing 12 of 12 computers')).toBeInTheDocument()
  })

  it('filters the list as the user types', async () => {
    const { user } = renderApp('/computers')
    await user.type(screen.getByLabelText('Search'), 'lenovo')
    expect(screen.getByText('Showing 2 of 12 computers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PC-0004' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'PC-0001' })).not.toBeInTheDocument()
  })

  it('filters by status and can clear filters', async () => {
    const { user } = renderApp('/computers')
    await user.selectOptions(screen.getByLabelText('Status'), 'Retired')
    expect(screen.getByText('Showing 1 of 12 computers')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Showing 12 of 12 computers')).toBeInTheDocument()
  })

  it('reads the status filter from the URL (dashboard links)', () => {
    renderApp('/computers?status=In%20Repair')
    expect(screen.getByText('Showing 1 of 12 computers')).toBeInTheDocument()
  })

  it('ignores unknown filter values in the URL', () => {
    renderApp('/computers?status=Lost&type=Phone&sort=hack')
    expect(screen.getByText('Showing 12 of 12 computers')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toHaveValue('All')
  })

  it('shows an empty state when nothing matches', async () => {
    const { user } = renderApp('/computers')
    await user.type(screen.getByLabelText('Search'), 'zzzz')
    expect(screen.getByText('No computers found.')).toBeInTheDocument()
  })

  it('shows the details of a computer', () => {
    renderApp('/computers/2')
    expect(screen.getByRole('heading', { level: 1, name: /Apple MacBook Pro/ })).toBeInTheDocument()
    expect(screen.getByText('C02FX1Q9MD6T')).toBeInTheDocument()
    expect(screen.getByText('Used for video editing.')).toBeInTheDocument()
  })
})

describe('add computer', () => {
  it('adds a new computer and shows it in the list', async () => {
    const { user } = renderApp('/computers/new')
    expect(screen.getByLabelText(/Asset tag/)).toHaveValue('PC-0013')

    await user.type(screen.getByLabelText(/Serial number/), 'TEST-SN-001')
    await user.type(screen.getByLabelText(/Brand/), 'Acer')
    await user.type(screen.getByLabelText(/^Model/), 'Swift Go 14')
    await user.selectOptions(screen.getByLabelText(/^Type/), 'Laptop')
    await user.type(screen.getByLabelText(/RAM/), '16')
    await user.type(screen.getByLabelText(/Storage/), '512')
    await user.type(screen.getByLabelText(/Purchase date/), '2025-05-05')
    await user.type(screen.getByLabelText(/Price/), '3999')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))

    expect(screen.getByRole('status')).toHaveTextContent('PC-0013 was added.')
    expect(screen.getByText('Showing 13 of 13 computers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PC-0013' })).toBeInTheDocument()
  })

  it('shows validation errors and does not save invalid data', async () => {
    const { user } = renderApp('/computers/new')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))

    expect(screen.getByText('Brand is required.')).toBeInTheDocument()
    expect(screen.getByText('Serial number is required.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Brand/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('heading', { level: 1, name: 'Add computer' })).toBeInTheDocument()
  })

  it('clears an error once the field is fixed', async () => {
    const { user } = renderApp('/computers/new')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))
    await user.type(screen.getByLabelText(/Brand/), 'Acer')
    expect(screen.queryByText('Brand is required.')).not.toBeInTheDocument()
  })

  it('cancel returns to the list without saving', async () => {
    const { user } = renderApp('/computers/new')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Showing 12 of 12 computers')).toBeInTheDocument()
  })
})

describe('update computer', () => {
  it('edits an existing computer', async () => {
    const { user } = renderApp('/computers')
    await user.click(screen.getByRole('link', { name: 'Edit PC-0004' }))

    const assignee = screen.getByLabelText(/Assigned to/)
    expect(screen.getByLabelText(/Brand/)).toHaveValue('Lenovo')
    await user.selectOptions(screen.getByLabelText(/^Status/), 'In Use')
    await user.type(assignee, 'Mona Alharthi')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('status')).toHaveTextContent('PC-0004 was updated.')
    expect(screen.getByText('Mona Alharthi')).toBeInTheDocument()
  })

  it('prevents using another computer’s asset tag', async () => {
    const { user } = renderApp('/computers/4/edit')
    const tag = screen.getByLabelText(/Asset tag/)
    await user.clear(tag)
    await user.type(tag, 'PC-0001')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText(/already used/)).toBeInTheDocument()
  })

  it('cancel goes back to the computer details', async () => {
    const { user } = renderApp('/computers/4/edit')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByRole('heading', { level: 1, name: /ThinkPad X1 Carbon/ })).toBeInTheDocument()
  })

  it('shows not-found when editing a missing computer', () => {
    renderApp('/computers/999/edit')
    expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument()
  })
})

describe('delete computer', () => {
  it('deletes a computer after confirmation', async () => {
    const { user } = renderApp('/computers')
    await user.click(screen.getByRole('button', { name: 'Delete PC-0003' }))

    const dialog = screen.getByRole('dialog', { name: 'Delete computer?' })
    expect(dialog).toHaveTextContent('PC-0003')
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(screen.getByRole('status')).toHaveTextContent('PC-0003 was deleted.')
    expect(screen.queryByRole('link', { name: 'PC-0003' })).not.toBeInTheDocument()
    expect(screen.getByText('Showing 11 of 11 computers')).toBeInTheDocument()
  })

  it('keeps the computer when the user cancels', async () => {
    const { user } = renderApp('/computers')
    await user.click(screen.getByRole('button', { name: 'Delete PC-0003' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    expect(screen.getByRole('link', { name: 'PC-0003' })).toBeInTheDocument()
  })

  it('deletes from the details page and returns to the list', async () => {
    const { user } = renderApp('/computers/5')
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('status')).toHaveTextContent('PC-0005 was deleted.')
    expect(screen.getByText('Showing 11 of 11 computers')).toBeInTheDocument()
  })
})
