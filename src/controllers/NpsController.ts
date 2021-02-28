import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


//classificação de notas do Nps (Net promoter Score)
//detratores 0-6
//passivos 7-8
//promotores 9-10

//cálculo de Nps = (número de promotores - número de detratores) / (número de respodentes) * 100

class NpsController {
    async execute(request: Request, response: Response) {

        const { survey_id } = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractors = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passives = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUsers.length;

        const calculate = Number(
            (((promoters - detractors) / (totalAnswers)) * 100).toFixed(2)
        );

        return response.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate,
        });

    }
}

export { NpsController };
