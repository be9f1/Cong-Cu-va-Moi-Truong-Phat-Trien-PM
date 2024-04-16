import { Controller, OnModuleInit } from '@nestjs/common';
import { DatabasesService } from './databases.service';

@Controller('databases')
export class DatabasesController implements OnModuleInit {

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
