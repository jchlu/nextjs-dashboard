import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
export default function AmountField({ state, defaultValue = null }) {
  const step = !defaultValue ? 'step="0.01"' : null
  return (
    <div className="mb-4">
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        Choose an amount
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter USD amount"
            defaultValue={defaultValue}
            step={step}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="amount-error"
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        {state.errors?.amount ? (
          <div
            id="amount-error"
            aria-live="polite"
            className="mt-2 text-sm text-red-500"
          >
            {state.errors.amount.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
