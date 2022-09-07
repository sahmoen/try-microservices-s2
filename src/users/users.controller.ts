import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateBookDto } from './dto/register-user.dto';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Client({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'kafkaSample',
  //       brokers: ['localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'my-kafka-consumer', // Should be the same thing we give in consumer
  //     },
  //   },
  // })
  // client: ClientKafka;

  // async onModuleInit() {
  //   // Need to subscribe to topic
  //   // so that we can get the response from kafka microservice
  //   this.client.subscribeToResponseOf('my-first-topic');
  //   await this.client.connect();
  // }

  // @Get()
  // async getHello() {
  //   return this.client.send('my-first-topic', [
  //     {
  //       name: 'Hallo Woy',
  //     },
  //   ]); // args - topic, message
  // }

  // @Get()
  // async getHello(): Promise<any> {
  //   return this.userService.getHello();
  // }

  @MessagePattern('my-second-topic') // Our topic name
  getHello2(@Payload() message: any) {
    console.log(message);
    return [message, '<<<<<'];
  }

  @Post('/register')
  async createUser(@Body() payload: CreateBookDto): Promise<User> {
    console.log(payload);

    return this.userService.createUser(payload);
  }
  @Post('/login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    return this.userService.loginUser(email, password);
  }
}
