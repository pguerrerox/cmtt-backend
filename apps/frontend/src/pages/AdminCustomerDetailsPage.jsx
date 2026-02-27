import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCustomerById, updateCustomer } from '../shared/api/customers.js'
import { createFacility, deleteFacility, getFacilities, updateFacility } from '../shared/api/facilities.js'
import { getProjectEngineers } from '../shared/api/projectEngineers.js'
import { getSalesManagers } from '../shared/api/salesManagers.js'

const initialFacilityForm = {
  name: '',
  address: '',
  contacts: ''
}

function toNullableId(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export default function AdminCustomerDetailsPage() {
  const { customerId } = useParams()
  const [customer, setCustomer] = useState(null)
  const [salesManagers, setSalesManagers] = useState([])
  const [projectEngineers, setProjectEngineers] = useState([])
  const [facilities, setFacilities] = useState([])
  const [customerForm, setCustomerForm] = useState({
    name: '',
    country: '',
    salesmanager_id: '',
    projecteng_id: '',
    special_instructions: ''
  })
  const [facilityForm, setFacilityForm] = useState(initialFacilityForm)
  const [editingFacilityId, setEditingFacilityId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const numericCustomerId = useMemo(() => Number(customerId), [customerId])

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const [customerResponse, facilitiesResponse, salesResponse, engineersResponse] = await Promise.all([
        getCustomerById(customerId),
        getFacilities(),
        getSalesManagers(),
        getProjectEngineers()
      ])

      const customerData = customerResponse?.data
      setCustomer(customerData)
      setCustomerForm({
        name: customerData?.name ?? '',
        country: customerData?.country ?? '',
        salesmanager_id: customerData?.salesmanager_id ? String(customerData.salesmanager_id) : '',
        projecteng_id: customerData?.projecteng_id ? String(customerData.projecteng_id) : '',
        special_instructions: customerData?.special_instructions ?? ''
      })
      setSalesManagers(salesResponse?.data ?? [])
      setProjectEngineers(engineersResponse?.data ?? [])

      const allFacilities = facilitiesResponse?.data ?? []
      setFacilities(allFacilities.filter((item) => Number(item.customer_id) === numericCustomerId))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [customerId])

  async function onSaveCustomer(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    try {
      await updateCustomer(customerId, {
        name: customerForm.name,
        country: customerForm.country,
        salesmanager_id: toNullableId(customerForm.salesmanager_id),
        projecteng_id: toNullableId(customerForm.projecteng_id),
        special_instructions: customerForm.special_instructions
      })
      setStatus('Customer updated successfully.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function onSaveFacility(event) {
    event.preventDefault()
    setStatus('')
    setError('')

    const payload = {
      name: facilityForm.name,
      address: facilityForm.address,
      contacts: facilityForm.contacts,
      customer_id: numericCustomerId
    }

    try {
      if (editingFacilityId) {
        await updateFacility(editingFacilityId, payload)
        setStatus('Facility updated successfully.')
      } else {
        await createFacility(payload)
        setStatus('Facility created successfully.')
      }
      setEditingFacilityId(null)
      setFacilityForm(initialFacilityForm)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  function onEditFacility(facility) {
    setEditingFacilityId(facility.id)
    setFacilityForm({
      name: facility.name ?? '',
      address: facility.address ?? '',
      contacts: facility.contacts ?? ''
    })
  }

  async function onDeleteFacility(facility) {
    if (!window.confirm(`Delete facility ${facility.name}?`)) return
    setStatus('')
    setError('')
    try {
      await deleteFacility(facility.id)
      setStatus('Facility deleted successfully.')
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="stack gap-lg">
      <div className="panel hero compact">
        <p className="eyebrow">Customer Details</p>
        <h2>{customer?.name || `Customer #${customerId}`}</h2>
        <p>Manage customer information and facilities.</p>
      </div>

      <div className="panel-header">
        <Link to="/admin/customers" className="ghost as-link">Back to Customers</Link>
      </div>

      {loading && <p>Loading customer...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && status && <p className="success">{status}</p>}

      {!loading && customer && (
        <form className="panel form-grid" onSubmit={onSaveCustomer}>
          <h3>Customer Information</h3>

          <label>
            Name
            <input
              required
              value={customerForm.name}
              onChange={(event) => setCustomerForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>

          <label>
            Country
            <input
              value={customerForm.country}
              onChange={(event) => setCustomerForm((prev) => ({ ...prev, country: event.target.value }))}
            />
          </label>

          <label>
            Sales Manager
            <select
              value={customerForm.salesmanager_id}
              onChange={(event) =>
                setCustomerForm((prev) => ({ ...prev, salesmanager_id: event.target.value }))
              }
            >
              <option value="">Not assigned</option>
              {salesManagers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            Project Engineer
            <select
              value={customerForm.projecteng_id}
              onChange={(event) =>
                setCustomerForm((prev) => ({ ...prev, projecteng_id: event.target.value }))
              }
            >
              <option value="">Not assigned</option>
              {projectEngineers.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            Special Instructions
            <textarea
              value={customerForm.special_instructions}
              onChange={(event) =>
                setCustomerForm((prev) => ({ ...prev, special_instructions: event.target.value }))
              }
            />
          </label>

          <button type="submit">Update Customer</button>
        </form>
      )}

      {!loading && customer && (
        <>
          <form className="panel form-grid" onSubmit={onSaveFacility}>
            <h3>{editingFacilityId ? 'Edit Facility' : 'Add Facility'}</h3>

            <label>
              Facility Name
              <input
                required
                value={facilityForm.name}
                onChange={(event) => setFacilityForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>

            <label>
              Address
              <textarea
                value={facilityForm.address}
                onChange={(event) =>
                  setFacilityForm((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </label>

            <label>
              Contacts
              <textarea
                value={facilityForm.contacts}
                onChange={(event) =>
                  setFacilityForm((prev) => ({ ...prev, contacts: event.target.value }))
                }
              />
            </label>

            <button type="submit">{editingFacilityId ? 'Update Facility' : 'Save Facility'}</button>
            {editingFacilityId && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingFacilityId(null)
                  setFacilityForm(initialFacilityForm)
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="panel">
            <div className="panel-header">
              <h3>Facilities</h3>
              <button type="button" className="ghost" onClick={loadData}>Refresh</button>
            </div>

            <ul className="entity-list">
              {facilities.length === 0 && <li className="entity-row empty">No facilities for this customer yet.</li>}
              {facilities.map((facility) => (
                <li key={facility.id} className="entity-row">
                  <div>
                    <strong>{facility.name}</strong>
                    <p>{facility.address || '-'}</p>
                  </div>
                  <span>{facility.contacts || '-'}</span>
                  <span />
                  <div className="entity-actions">
                    <button type="button" className="ghost" onClick={() => onEditFacility(facility)}>Edit</button>
                    <button
                      type="button"
                      className="ghost danger-text"
                      onClick={() => onDeleteFacility(facility)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
