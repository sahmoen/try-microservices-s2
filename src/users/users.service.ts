import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateBookDto } from './dto/register-user.dto';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaSample',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'my-kafka-consumer', // Should be the same thing we give in consumer
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    // Need to subscribe to topic
    // so that we can get the response from kafka microservice
    this.client.subscribeToResponseOf('my-first-topic');
    await this.client.connect();
  }

  // async getHello(): Promise<any> {
  //   return this.client.send('my-first-topic', [
  //     {
  //       name: 'Hallo Kawula Muda yang cakep2',
  //     },
  //   ]); // args - topic, message
  // }

  async createUser(createUserDto: CreateBookDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const user = this.userRepository.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      return user.save();
    } catch (err) {
      console.log(err);
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      let result = [];
      const user = await this.userRepository.find({
        where: {
          email,
        },
      });
      // console.log(user[0].password);

      if (!user) {
        throw new NotFoundException(`User Not Found`);
      }

      const checkPass = bcrypt.compareSync(password, user[0].password);
      if (!checkPass) {
        throw new NotFoundException(`User Not Found`);
      }

      // result.push(user);

      const payloadClient = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      };

      result.push(payloadClient);

      const token = jwt.sign(payloadClient, 'iniKey');

      result.push(token);

      return this.client.send('my-first-topic', payloadClient);

      // return result;
    } catch (err) {
      console.log(err);
    }
  }
}
