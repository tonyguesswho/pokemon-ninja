import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getPokemon(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Req() req,
  ) {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    return this.pokemonService.getPokemonWithFavoriteStatus(
      userId,
      organizationId,
      page,
      limit,
    );
  }

  @Post(':id/toggle-favorite')
  async toggleFavorite(@Param('id') id: number, @Req() req) {
    try {
      const result = await this.pokemonService.toggleFavorite(req.user.id, id);
      return {
        message: result.isFavorited
          ? 'Pokemon favorited successfully'
          : 'Pokemon unfavorited successfully',
        isFavorited: result.isFavorited,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
