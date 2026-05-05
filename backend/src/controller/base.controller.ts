import { Repository } from "typeorm";

export abstract class Controller {
    repository: Repository<any>;

    getAll = async (req, res) => {
        try {
            const entities = await this.repository.find();
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = req.params['id'];

            const entity = await this.repository.findOneBy({ id: id });
            if (!entity) {
                return this.handleError(res, null, 404, 'No entity exists with the given id.');
            }

            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    create = async (req, res) => {
        try {
            const entityToCreate = this.repository.create(req.body);
            delete entityToCreate['id'];
            const entitySaved = await this.repository.save(entityToCreate);
            res.json(entitySaved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    update = async (req, res) => {
        try {
            const entityToSave = this.repository.create(req.body);
            if (!entityToSave.id) {
                return this.handleError(res, null, 400, 'Entity id must be defined.');
            }

            const entity = await this.repository.findOneBy({ id: entityToSave.id });
            if (!entity) {
                return this.handleError(res, null, 404, 'No entity exists with the given id.');
            }

            const entitySaved = await this.repository.save(entityToSave);
            res.json(entitySaved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    delete = async (req, res) => {
        try {
            const id = req.params['id'];
            const entity = await this.repository.findOneBy({ id: id });
            if (!entity) {
                return this.handleError(res, null, 404, 'No entity exists with the given id.');
            }

            await this.repository.remove(entity);
            res.send();
        } catch (err) {
            this.handleError(res, err);
        }
    };

    handleError = (res, err, status = 500, message = 'Unknown server error') => {
        if (err) {
            console.error(err);
        }

        res.status(status).json({ error: message });
    }
}
