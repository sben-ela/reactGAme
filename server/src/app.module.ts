import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { Game } from './game/Game';


@Module({
  imports: [EventsModule],
  controllers: [AppController],
  providers: [AppService, Game],
})
export class AppModule {}
