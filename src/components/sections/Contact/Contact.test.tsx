import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  contactContent,
  demoTimeOptions,
  largeTeamSize,
  MESSAGE_MAX_LENGTH,
  teamSizeOptions,
} from '../../../data/contact'
import { Contact } from './Contact'

type User = ReturnType<typeof userEvent.setup>

const textbox = (name: string) => screen.getByRole('textbox', { name })
const teamSize = () => screen.getByRole('combobox', { name: 'Team Size' })
const demoTime = () =>
  screen.queryByRole('combobox', { name: 'Preferred Demo Time' })
const termsBox = () => screen.getByRole('checkbox', { name: /i agree/i })
const submitButton = () =>
  screen.getByRole('button', { name: /send message|sending/i })

const validMessage = 'We would like a demo of the platform.'

async function fillValid(user: User, size = '11-50') {
  await user.type(textbox('Full Name'), 'Jane Cooper')
  await user.type(textbox('Work Email'), 'jane@acme.com')
  await user.type(textbox('Company Name'), 'Acme Inc.')
  await user.selectOptions(teamSize(), size)
  await user.type(textbox('Message'), validMessage)
  await user.click(termsBox())
}

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const user = userEvent.setup()
  const view = render(<Contact onSubmit={onSubmit} />)
  return { user, onSubmit, ...view }
}

describe('Contact', () => {
  it('renders the heading, description and every field', () => {
    setup()

    expect(
      screen.getByRole('heading', { level: 2, name: contactContent.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(contactContent.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(contactContent.description)).toBeInTheDocument()

    ;['Full Name', 'Work Email', 'Company Name', 'Message'].forEach((name) => {
      expect(textbox(name)).toBeInTheDocument()
    })
    expect(teamSize()).toBeInTheDocument()
    expect(termsBox()).toBeInTheDocument()
    expect(submitButton()).toHaveTextContent(contactContent.submit)
  })

  it('marks every field as required', () => {
    setup()

    ;[
      textbox('Full Name'),
      textbox('Work Email'),
      textbox('Company Name'),
      teamSize(),
      textbox('Message'),
      termsBox(),
    ].forEach((control) => {
      expect(control).toHaveAttribute('aria-required', 'true')
    })
  })

  it('offers the team size options', () => {
    setup()

    const options = within(teamSize()).getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'Select team size',
      ...teamSizeOptions.map((option) => option.label),
    ])
  })

  describe('validation', () => {
    it('shows a clear message and a red border for every empty required field', async () => {
      const { user, onSubmit } = setup()

      await user.click(submitButton())

      const expected: [HTMLElement, string][] = [
        [textbox('Full Name'), 'Full name is required'],
        [textbox('Work Email'), 'Work email is required'],
        [textbox('Company Name'), 'Company name is required'],
        [teamSize(), 'Select your team size'],
        [textbox('Message'), 'Message is required'],
        [
          termsBox(),
          'You must agree to the Terms of Service and Privacy Policy',
        ],
      ]

      for (const [control, message] of expected) {
        expect(await screen.findByText(message)).toBeInTheDocument()
        expect(control).toHaveAttribute('aria-invalid', 'true')
        expect(control).toHaveAccessibleDescription(message)
      }

      ;[
        textbox('Full Name'),
        textbox('Work Email'),
        textbox('Company Name'),
        teamSize(),
        textbox('Message'),
      ].forEach((control) => {
        expect(control).toHaveClass('border-red-500')
        expect(control).not.toHaveClass('border-line')
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('moves focus to the first field with an error', async () => {
      const { user } = setup()

      await user.click(submitButton())

      await waitFor(() => expect(textbox('Full Name')).toHaveFocus())
    })

    it('rejects a name that is too short', async () => {
      const { user } = setup()

      await user.type(textbox('Full Name'), 'J')
      await user.tab()

      expect(
        await screen.findByText('Full name must be at least 2 characters'),
      ).toBeInTheDocument()
    })

    it('rejects an invalid email address', async () => {
      const { user } = setup()

      await user.type(textbox('Work Email'), 'jane@')
      await user.tab()

      expect(
        await screen.findByText(
          'Enter a valid email address, like you@company.com',
        ),
      ).toBeInTheDocument()
      expect(textbox('Work Email')).toHaveClass('border-red-500')
    })

    it('rejects a message that is too short', async () => {
      const { user } = setup()

      await user.type(textbox('Message'), 'Hi')
      await user.tab()

      expect(
        await screen.findByText('Message must be at least 10 characters'),
      ).toBeInTheDocument()
    })

    it('treats whitespace as empty', async () => {
      const { user } = setup()

      await user.type(textbox('Company Name'), '    ')
      await user.tab()

      expect(
        await screen.findByText('Company name is required'),
      ).toBeInTheDocument()
    })

    it('shows an error once a field is left empty, before submitting', async () => {
      const { user } = setup()

      await user.click(textbox('Full Name'))
      await user.tab()

      expect(
        await screen.findByText('Full name is required'),
      ).toBeInTheDocument()
    })

    it('clears the error and the red border as soon as the field is fixed', async () => {
      const { user } = setup()

      await user.click(submitButton())
      expect(
        await screen.findByText('Full name is required'),
      ).toBeInTheDocument()

      await user.type(textbox('Full Name'), 'Jane')

      await waitFor(() =>
        expect(textbox('Full Name')).toHaveAttribute('aria-invalid', 'false'),
      )
      expect(textbox('Full Name')).toHaveClass('border-line')
      expect(textbox('Full Name')).not.toHaveClass('border-red-500')
      expect(textbox('Full Name')).not.toHaveAttribute('aria-describedby')
    })

    it('requires the terms to be accepted', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user)
      await user.click(termsBox())
      await user.click(submitButton())

      expect(
        await screen.findByText(
          'You must agree to the Terms of Service and Privacy Policy',
        ),
      ).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()

      await user.click(termsBox())
      await waitFor(() =>
        expect(termsBox()).toHaveAttribute('aria-invalid', 'false'),
      )
    })
  })

  describe('message counter', () => {
    it('counts the characters and limits them to 300', async () => {
      const { user } = setup()

      expect(screen.getByText(`0/${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument()
      expect(textbox('Message')).toHaveAttribute(
        'maxlength',
        String(MESSAGE_MAX_LENGTH),
      )

      await user.type(textbox('Message'), 'Hello there')
      expect(screen.getByText(`11/${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument()
    })
  })

  describe('Preferred Demo Time', () => {
    it('is hidden, and not reachable, until the team size is 200+', () => {
      setup()

      expect(demoTime()).not.toBeInTheDocument()
    })

    it.each(teamSizeOptions.filter((option) => option.value !== largeTeamSize))(
      'stays hidden for $label',
      async ({ value }) => {
        const { user } = setup()

        await user.selectOptions(teamSize(), value)

        expect(demoTime()).not.toBeInTheDocument()
      },
    )

    it('appears when the team size is 200+ with the three options', async () => {
      const { user } = setup()

      await user.selectOptions(teamSize(), largeTeamSize)

      const select = await screen.findByRole('combobox', {
        name: 'Preferred Demo Time',
      })
      expect(select).toHaveAttribute('aria-required', 'true')
      expect(
        within(select)
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual([
        'Select a time',
        ...demoTimeOptions.map((option) => option.label),
      ])
      expect(demoTimeOptions.map((option) => option.label)).toEqual([
        'Morning',
        'Afternoon',
        'Evening',
      ])
    })

    it('is required when shown: an error, a red border, and no submission', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user, largeTeamSize)
      await user.click(submitButton())

      expect(
        await screen.findByText('Select a preferred demo time'),
      ).toBeInTheDocument()
      expect(demoTime()).toHaveAttribute('aria-invalid', 'true')
      expect(demoTime()).toHaveClass('border-red-500')
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('clears its error when a time is chosen, then submits with it', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user, largeTeamSize)
      await user.click(submitButton())
      await screen.findByText('Select a preferred demo time')

      await user.selectOptions(demoTime() as HTMLElement, 'afternoon')
      await waitFor(() =>
        expect(demoTime()).toHaveAttribute('aria-invalid', 'false'),
      )

      await user.click(submitButton())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: 'Jane Cooper',
        workEmail: 'jane@acme.com',
        companyName: 'Acme Inc.',
        teamSize: largeTeamSize,
        demoTime: 'afternoon',
        message: validMessage,
        terms: true,
      })
    })

    it('hides again, clears its error and skips validation when the team size changes', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user, largeTeamSize)
      await user.click(submitButton())
      await screen.findByText('Select a preferred demo time')

      await user.selectOptions(teamSize(), '11-50')

      expect(demoTime()).not.toBeInTheDocument()
      await waitFor(() =>
        expect(
          screen.queryByText('Select a preferred demo time', {
            ignore: '[aria-hidden="true"] *',
          }),
        ).not.toBeInTheDocument(),
      )

      await user.click(submitButton())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    })

    it('leaves the demo time out of what is sent when it is hidden', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user, largeTeamSize)
      await user.selectOptions(demoTime() as HTMLElement, 'evening')
      await user.selectOptions(teamSize(), '51-200')
      await user.click(submitButton())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      const sent = onSubmit.mock.calls[0][0]
      expect(sent).not.toHaveProperty('demoTime')
      expect(sent.teamSize).toBe('51-200')
    })

    it('forgets the chosen time when it is hidden and shown again', async () => {
      const { user } = setup()

      await user.selectOptions(teamSize(), largeTeamSize)
      await user.selectOptions(demoTime() as HTMLElement, 'morning')
      await user.selectOptions(teamSize(), '1-10')
      await user.selectOptions(teamSize(), largeTeamSize)

      expect(demoTime()).toHaveValue('')
    })

    it('opens and closes with a smooth height animation', async () => {
      const { user, container } = setup()

      const wrapper = () =>
        container
          .querySelector('#demoTime')
          ?.closest('.grid') as HTMLElement | null

      expect(wrapper()).toHaveClass('grid-rows-[0fr]', 'opacity-0')
      expect(wrapper()).toHaveClass('transition-[grid-template-rows,opacity]')

      await user.selectOptions(teamSize(), largeTeamSize)
      expect(wrapper()).toHaveClass('grid-rows-[1fr]', 'opacity-100')
    })
  })

  describe('submitting', () => {
    it('sends the values and shows a thank-you message', async () => {
      const { user, onSubmit } = setup()

      await fillValid(user)
      await user.click(submitButton())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: 'Jane Cooper',
        workEmail: 'jane@acme.com',
        companyName: 'Acme Inc.',
        teamSize: '11-50',
        message: validMessage,
        terms: true,
      })

      const status = await screen.findByRole('status')
      expect(status).toHaveTextContent('Thanks, Jane!')
    })

    it('clears the form after a successful submission', async () => {
      const { user } = setup()

      await fillValid(user)
      await user.click(submitButton())
      await screen.findByRole('status')

      expect(textbox('Full Name')).toHaveValue('')
      expect(textbox('Work Email')).toHaveValue('')
      expect(teamSize()).toHaveValue('')
      expect(textbox('Message')).toHaveValue('')
      expect(termsBox()).not.toBeChecked()
      expect(screen.getByText(`0/${MESSAGE_MAX_LENGTH}`)).toBeInTheDocument()
    })

    it('disables the button while sending', async () => {
      let finish: () => void = () => {}
      const onSubmit = vi.fn(
        () => new Promise<void>((resolve) => (finish = resolve)),
      )
      const { user } = setup(onSubmit)

      await fillValid(user)
      await user.click(submitButton())

      await waitFor(() => expect(submitButton()).toBeDisabled())
      expect(submitButton()).toHaveTextContent(contactContent.submitting)

      finish()
      await screen.findByRole('status')
      expect(submitButton()).toBeEnabled()
      expect(submitButton()).toHaveTextContent(contactContent.submit)
    })
  })

  it('sizes everything from content and padding, with no fixed heights or widths', () => {
    const { container } = setup()

    const fixedSize = /^(?:[a-z-]+:)*(?:h|w)-(?:\d|\[)/
    const offenders = [...container.querySelectorAll('[class]')].flatMap(
      (element) =>
        [...element.classList].filter((name) => fixedSize.test(name)),
    )

    expect(offenders).toEqual([])
  })

  it('uses the global container and is the target of the contact links', () => {
    const { container } = setup()

    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
})
