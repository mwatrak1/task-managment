import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../types/task-status.enum';

export class GetTasksFiltetDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
