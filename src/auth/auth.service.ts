import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtEncoded } from './types/jwt-encoded.interface';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtEncoded> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const decryptionResult = await this.decryptPassword(
      password,
      user.password,
    );

    if (!decryptionResult) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.generateJwt({ username });
  }

  private async createUser(createUserDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  private generateJwt(payload: JwtPayload): JwtEncoded {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: AuthCredentialsDto['password']) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async decryptPassword(inputPassword: string, hashPassword: string) {
    return await bcrypt.compare(inputPassword, hashPassword);
  }
}
