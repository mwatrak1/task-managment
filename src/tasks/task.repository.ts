import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFiltetDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './types/task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFiltetDto, user: User) {
    const query = this.buildFilterQuery(filterDto, user);
    return await query.getMany();
  }

  private buildFilterQuery(filterDto: GetTasksFiltetDto, user: User) {
    const query = this.createQueryBuilder('task');
    const { search, status } = filterDto;
    query.where({ user });

    if (status) {
      query.andWhere('status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '( LOWER(description) LIKE LOWER(:search) OR LOWER(title) LIKE LOWER(:search) )',
        { search: `%${search}%` },
      );
    }

    return query;
  }
}
