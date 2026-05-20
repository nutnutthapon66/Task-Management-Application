import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import TaskCard from '@/components/tasks/TaskCard.vue'
import type { Task } from '@/models'
import { TaskStatus, TaskPriority } from '@/models'

const task: Task = {
  id: 1,
  title: 'Write tests',
  description: 'Cover all critical paths',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  order: 0,
  createdAt: '2024-01-15T10:00:00.000Z',
}

describe('TaskCard', () => {
  const wrapper = () =>
    mount(TaskCard, {
      props: { task },
      global: { plugins: [createPinia()] },
    })

  it('renders task title', () => {
    const w = wrapper()
    expect(w.text()).toContain('Write tests')
  })

  it('renders task description', () => {
    const w = wrapper()
    expect(w.text()).toContain('Cover all critical paths')
  })

  it('emits edit event on pencil button click', async () => {
    const w = wrapper()
    const editBtn = w.find('[title]') // first action button
    await w.findAll('button')[0].trigger('click')
    // check that edit was emitted
    expect(w.emitted()).toHaveProperty('edit')
  })

  it('emits delete event on delete button click', async () => {
    const w = wrapper()
    const btns = w.findAll('button')
    await btns[btns.length - 1].trigger('click')
    expect(w.emitted()).toHaveProperty('delete')
  })
})
