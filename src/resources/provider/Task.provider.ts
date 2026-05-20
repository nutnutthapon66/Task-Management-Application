import type { Task, TaskFormData } from '@/models'
import type { TaskStatus } from '@/models'
import HttpRequest from '../HttpRequest'

export interface ITaskProvider {
  getAll(): Promise<Task[]>
  getById(id: number): Promise<Task>
  create(payload: TaskFormData): Promise<Task>
  update(id: number, payload: Partial<TaskFormData>): Promise<Task>
  updateStatus(id: number, status: TaskStatus, order: number): Promise<Task>
  reorder(id: number, order: number): Promise<Task>
  remove(id: number): Promise<void>
}

class TaskProvider extends HttpRequest implements ITaskProvider {
  private urlPrefix = '/tasks'

  public async getAll(): Promise<Task[]> {
    const response = await this.get(this.urlPrefix)
    return response
  }

  public async getById(id: number): Promise<Task> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async create(payload: TaskFormData): Promise<Task> {
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  public async update(id: number, payload: Partial<TaskFormData>): Promise<Task> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async updateStatus(id: number, status: TaskStatus, order: number): Promise<Task> {
    const response = await this.patch(`${this.urlPrefix}/${id}/status`, { status, order })
    return response
  }

  public async reorder(id: number, order: number): Promise<Task> {
    const response = await this.patch(`${this.urlPrefix}/${id}/order`, { order })
    return response
  }

  public async remove(id: number): Promise<void> {
    await this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default TaskProvider
